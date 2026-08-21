import {Request, Response} from 'express';
import newrelic from 'newrelic';
import {
  createExternalInboundNrMiddleware,
  createOutboundNrMiddleware,
  createPubSubNrMiddleware,
} from '../../../src/common/newrelic-middleware';

jest.mock('newrelic', () => ({
  addCustomAttribute: jest.fn(),
}));

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeReq(overrides: Partial<Request> = {}): Request {
  const childMock = jest.fn().mockReturnThis();
  return {
    get: jest.fn().mockReturnValue(undefined),
    body: {},
    log: {
      info: jest.fn(),
      error: jest.fn(),
      child: childMock,
    },
    traceIds: undefined,
    ...overrides,
  } as unknown as Request;
}

function makeRes(): Response {
  return {set: jest.fn()} as unknown as Response;
}

const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.ENABLE_NEW_RELIC;
});

// ---------------------------------------------------------------------------
// createExternalInboundNrMiddleware
// ---------------------------------------------------------------------------

describe('createExternalInboundNrMiddleware', () => {
  it('always sets req.traceIds, enriches logger, and sets response headers', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({get: jest.fn().mockReturnValue(undefined)});
    const res = makeRes();

    void middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.traceIds).toBeDefined();
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
    expect(res.set).toHaveBeenCalledWith(
      'called-unique-id',
      expect.stringMatching(UUID_REGEX),
    );
  });

  it('does not call newrelic.addCustomAttribute when ENABLE_NEW_RELIC is not true', () => {
    const middleware = createExternalInboundNrMiddleware();
    void middleware(makeReq(), makeRes(), next);
    expect(newrelic.addCustomAttribute).not.toHaveBeenCalled();
  });

  it('when origin-unique-id header is present, all three fields are set', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({
      get: jest
        .fn()
        .mockImplementation((h: string) =>
          h === 'origin-unique-id' ? 'test-origin-id' : undefined,
        ),
    });
    const res = makeRes();

    void middleware(req, res, next);

    expect(req.traceIds!.originUniqueId).toBe('test-origin-id');
    expect(req.traceIds!.callerUniqueId).toBe('test-origin-id');
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);

    expect(res.set).toHaveBeenCalledWith('origin-unique-id', 'test-origin-id');
    expect(res.set).toHaveBeenCalledWith('caller-unique-id', 'test-origin-id');
    expect(res.set).toHaveBeenCalledWith(
      'called-unique-id',
      expect.stringMatching(UUID_REGEX),
    );
  });

  it('when origin-unique-id is absent and req.id is not set, neither origin nor caller are set on traceIds or headers', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({get: jest.fn().mockReturnValue(undefined)});
    const res = makeRes();

    void middleware(req, res, next);

    expect(req.traceIds!.originUniqueId).toBeUndefined();
    expect(req.traceIds!.callerUniqueId).toBeUndefined();
    expect(res.set).not.toHaveBeenCalledWith(
      'origin-unique-id',
      expect.anything(),
    );
  });

  it('when origin-unique-id header is absent but req.id is set, req.id is used as origin and caller', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({
      get: jest.fn().mockReturnValue(undefined),
      id: 'req-id-from-cdp',
    } as any);
    const res = makeRes();

    void middleware(req, res, next);

    expect(req.traceIds!.originUniqueId).toBe('req-id-from-cdp');
    expect(req.traceIds!.callerUniqueId).toBe('req-id-from-cdp');
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
    expect(res.set).toHaveBeenCalledWith('origin-unique-id', 'req-id-from-cdp');
    expect(res.set).toHaveBeenCalledWith('caller-unique-id', 'req-id-from-cdp');
  });

  it('origin-unique-id header takes precedence over req.id', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({
      get: jest
        .fn()
        .mockImplementation((h: string) =>
          h === 'origin-unique-id' ? 'header-origin' : undefined,
        ),
      id: 'req-id-ignored',
    } as any);
    const res = makeRes();

    void middleware(req, res, next);

    expect(req.traceIds!.originUniqueId).toBe('header-origin');
    expect(req.traceIds!.callerUniqueId).toBe('header-origin');
  });

  it('never reads called-unique-id from the request — always generates fresh', () => {
    const middleware = createExternalInboundNrMiddleware();
    const req = makeReq({
      get: jest
        .fn()
        .mockImplementation((h: string) =>
          h === 'called-unique-id' ? 'attacker-supplied-id' : undefined,
        ),
    });
    void middleware(req, makeRes(), next);
    expect(req.traceIds!.calledUniqueId).not.toBe('attacker-supplied-id');
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
  });

  it('enriches req.log with a child logger containing the trace fields', () => {
    const middleware = createExternalInboundNrMiddleware();
    const childLogger = {info: jest.fn(), error: jest.fn(), child: jest.fn()};
    const childMock = jest.fn().mockReturnValue(childLogger);
    const req = makeReq({
      get: jest
        .fn()
        .mockImplementation((h: string) =>
          h === 'origin-unique-id' ? 'some-origin' : undefined,
        ),
      log: {info: jest.fn(), error: jest.fn(), child: childMock} as any,
    });

    void createExternalInboundNrMiddleware()(req, makeRes(), next);

    expect(childMock).toHaveBeenCalledWith(
      expect.objectContaining({
        'origin-unique-id': 'some-origin',
        'caller-unique-id': 'some-origin',
        'called-unique-id': expect.stringMatching(UUID_REGEX),
      }),
    );
    expect(req.log).toBe(childLogger);
  });

  describe('when ENABLE_NEW_RELIC=true', () => {
    beforeEach(() => {
      process.env.ENABLE_NEW_RELIC = 'true';
    });

    it('calls newrelic.addCustomAttribute for all three fields when origin is present', () => {
      const middleware = createExternalInboundNrMiddleware();
      const req = makeReq({
        get: jest
          .fn()
          .mockImplementation((h: string) =>
            h === 'origin-unique-id' ? 'test-origin-id' : undefined,
          ),
      });

      void middleware(req, makeRes(), next);

      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'origin-unique-id',
        'test-origin-id',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'caller-unique-id',
        'test-origin-id',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'called-unique-id',
        expect.stringMatching(UUID_REGEX),
      );
    });

    it('only calls addCustomAttribute for called-unique-id when origin is absent', () => {
      const middleware = createExternalInboundNrMiddleware();
      void middleware(makeReq(), makeRes(), next);
      expect(newrelic.addCustomAttribute).toHaveBeenCalledTimes(1);
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'called-unique-id',
        expect.stringMatching(UUID_REGEX),
      );
    });
  });
});

// ---------------------------------------------------------------------------
// createOutboundNrMiddleware
// ---------------------------------------------------------------------------

describe('createOutboundNrMiddleware', () => {
  it('always sets req.traceIds', () => {
    const middleware = createOutboundNrMiddleware();
    const req = makeReq({body: {headers: {eesEventId: 'ees-123'}}});

    void middleware(req, makeRes(), next);

    expect(req.traceIds!.originUniqueId).toBe('ees-123');
    expect(req.traceIds!.callerUniqueId).toBe('ees-123');
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
  });

  it('does not call newrelic.addCustomAttribute when ENABLE_NEW_RELIC is not true', () => {
    const middleware = createOutboundNrMiddleware();
    void middleware(
      makeReq({body: {headers: {eesEventId: 'ees-123'}}}),
      makeRes(),
      next,
    );
    expect(newrelic.addCustomAttribute).not.toHaveBeenCalled();
  });

  it('still generates called-unique-id when eesEventId is absent', () => {
    const middleware = createOutboundNrMiddleware();
    const req = makeReq({body: {headers: {}}});
    void middleware(req, makeRes(), next);
    expect(req.traceIds!.originUniqueId).toBeUndefined();
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
  });

  describe('when ENABLE_NEW_RELIC=true', () => {
    beforeEach(() => {
      process.env.ENABLE_NEW_RELIC = 'true';
    });

    it('calls newrelic.addCustomAttribute for all three fields', () => {
      const middleware = createOutboundNrMiddleware();
      const req = makeReq({body: {headers: {eesEventId: 'ees-123'}}});
      void middleware(req, makeRes(), next);

      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'origin-unique-id',
        'ees-123',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'caller-unique-id',
        'ees-123',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'called-unique-id',
        expect.stringMatching(UUID_REGEX),
      );
    });
  });
});

// ---------------------------------------------------------------------------
// createPubSubNrMiddleware
// ---------------------------------------------------------------------------

describe('createPubSubNrMiddleware', () => {
  it('always sets req.traceIds from PubSub message attributes', () => {
    const middleware = createPubSubNrMiddleware();
    const req = makeReq({
      body: {
        message: {
          attributes: {
            'origin-unique-id': 'origin-abc',
            'called-unique-id': 'prev-called-xyz',
          },
        },
      },
    });

    void middleware(req, makeRes(), next);

    expect(req.traceIds!.originUniqueId).toBe('origin-abc');
    expect(req.traceIds!.callerUniqueId).toBe('prev-called-xyz');
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
  });

  it('does not call newrelic.addCustomAttribute when ENABLE_NEW_RELIC is not true', () => {
    const middleware = createPubSubNrMiddleware();
    void middleware(
      makeReq({body: {message: {attributes: {'called-unique-id': 'xyz'}}}}),
      makeRes(),
      next,
    );
    expect(newrelic.addCustomAttribute).not.toHaveBeenCalled();
  });

  it('when origin-unique-id is absent from attributes, callerUniqueId is still set from called-unique-id', () => {
    const middleware = createPubSubNrMiddleware();
    const req = makeReq({
      body: {message: {attributes: {'called-unique-id': 'prev-xyz'}}},
    });

    void middleware(req, makeRes(), next);

    expect(req.traceIds!.originUniqueId).toBeUndefined();
    expect(req.traceIds!.callerUniqueId).toBe('prev-xyz');
  });

  it('always generates a fresh called-unique-id', () => {
    const middleware = createPubSubNrMiddleware();
    const req = makeReq({body: {message: {attributes: {}}}});
    void middleware(req, makeRes(), next);
    expect(req.traceIds!.calledUniqueId).toMatch(UUID_REGEX);
  });

  describe('when ENABLE_NEW_RELIC=true', () => {
    beforeEach(() => {
      process.env.ENABLE_NEW_RELIC = 'true';
    });

    it('calls newrelic.addCustomAttribute for all present fields', () => {
      const middleware = createPubSubNrMiddleware();
      const req = makeReq({
        body: {
          message: {
            attributes: {
              'origin-unique-id': 'origin-abc',
              'called-unique-id': 'prev-xyz',
            },
          },
        },
      });

      void middleware(req, makeRes(), next);

      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'origin-unique-id',
        'origin-abc',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'caller-unique-id',
        'prev-xyz',
      );
      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
        'called-unique-id',
        expect.stringMatching(UUID_REGEX),
      );
    });
  });
});
