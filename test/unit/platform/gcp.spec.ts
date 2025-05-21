import {ApplicationConfig, Logger} from '../../../src';

const mockTopic = {
  publishMessage: jest.fn(),
};

const mockPubSub = {
  topic: jest.fn().mockReturnValue(mockTopic),
};

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

import {sendMessageToGcpPubSubTopic} from '../../../src/platform/gcp';
import {PubSub} from '@google-cloud/pubsub';

jest.mock('@google-cloud/pubsub', () => {
  return {
    __esModule: true,
    PubSub: jest.fn().mockReturnValue(mockPubSub),
  };
});

describe('sendMessageToGcpPubSubTopic', () => {
  it('sends the message to the topic', async () => {
    // Arrange
    const appConfig: ApplicationConfig = {
      platformConfig: {
        projectId: 'some-project',
      },
    } as ApplicationConfig;

    // Act
    const output = await sendMessageToGcpPubSubTopic(
      appConfig,
      'some-name',
      {
        some: 'data',
      },
      {
        some: 'attribute',
      },
      mockLogger,
    );

    // Assert
    expect(output).toBeUndefined();
    expect(PubSub).toHaveBeenCalledWith({projectId: 'some-project'});
    expect(mockTopic.publishMessage).toHaveBeenCalledWith({
      json: {
        some: 'data',
      },
      attributes: {
        some: 'attribute',
      },
    });
  });
});
