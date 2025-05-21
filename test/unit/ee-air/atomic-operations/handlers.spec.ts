import {
  AtomicOperation,
  isCampaignEntity,
  isPlanEntity,
  isSchemeEntity,
  isFundEntity,
  isFundTransactionEntity,
  isPointsRewardBankEntity,
  isPointsRewardBankRewardEntity,
  isPointsRewardBankWalletLinkEntity,
  isSupplierUnitEntity,
  isTierMembershipEntity,
  isTierMembershipTransactionEntity,
  isWalletAccountEntity,
  isWalletAccountTransactionEntity,
  isWalletConsumerEntity,
  isWalletEntity,
  isWalletIdentityEntity,
  isWalletInviteEntity,
  isWalletTransactionEntity,
  isWalletAccountTransactionEntityCreateEcoupon,
  isWalletAccountTransactionEntityUpdateEcoupon,
  WalletAccountTransactionEntity,
} from '../../../../src';

describe('atomic-operations', () => {
  describe.each([
    {
      fn: isCampaignEntity,
      fnName: 'isCampaignEntity',
      objectType: 'campaignEntity',
    },
    {
      fn: isPlanEntity,
      fnName: 'isPlanEntity',
      objectType: 'planEntity',
    },
    {
      fn: isSchemeEntity,
      fnName: 'isSchemeEntity',
      objectType: 'schemeEntity',
    },
    {
      fn: isFundEntity,
      fnName: 'isFundEntity',
      objectType: 'fundEntity',
    },
    {
      fn: isFundTransactionEntity,
      fnName: 'isFundTransactionEntity',
      objectType: 'fundTransactionEntity',
    },
    {
      fn: isPointsRewardBankEntity,
      fnName: 'isPointsRewardBankEntity',
      objectType: 'pointsRewardBankEntity',
    },
    {
      fn: isPointsRewardBankRewardEntity,
      fnName: 'isPointsRewardBankRewardEntity',
      objectType: 'pointsRewardBankRewardEntity',
    },
    {
      fn: isPointsRewardBankWalletLinkEntity,
      fnName: 'isPointsRewardBankWalletLinkEntity',
      objectType: 'pointsRewardBankWalletLinkEntity',
    },
    {
      fn: isSupplierUnitEntity,
      fnName: 'isSupplierUnitEntity',
      objectType: 'supplierUnitEntity',
    },
    {
      fn: isTierMembershipEntity,
      fnName: 'isTierMembershipEntity',
      objectType: 'tierMembershipEntity',
    },
    {
      fn: isTierMembershipTransactionEntity,
      fnName: 'isTierMembershipTransactionEntity',
      objectType: 'tierMembershipTransactionEntity',
    },
    {
      fn: isWalletAccountEntity,
      fnName: 'isWalletAccountEntity',
      objectType: 'walletAccountEntity',
    },
    {
      fn: isWalletAccountTransactionEntity,
      fnName: 'isWalletAccountTransactionEntity',
      objectType: 'walletAccountTransactionEntity',
    },
    {
      fn: isWalletConsumerEntity,
      fnName: 'isWalletConsumerEntity',
      objectType: 'walletConsumerEntity',
    },
    {
      fn: isWalletEntity,
      fnName: 'isWalletEntity',
      objectType: 'walletEntity',
    },
    {
      fn: isWalletIdentityEntity,
      fnName: 'isWalletIdentityEntity',
      objectType: 'walletIdentityEntity',
    },
    {
      fn: isWalletInviteEntity,
      fnName: 'isWalletInviteEntity',
      objectType: 'walletInviteEntity',
    },
    {
      fn: isWalletTransactionEntity,
      fnName: 'isWalletTransactionEntity',
      objectType: 'walletTransactionEntity',
    },
  ])('$fnName', ({fn, objectType}) => {
    it(`returns true atomic operation is ${objectType}`, () => {
      const atomicOperation = {
        objectType,
      } as AtomicOperation;

      const output = fn(atomicOperation);

      expect(output).toBe(true);
    });

    it(`returns false if atomic operation is not ${objectType}`, () => {
      const atomicOperation = {
        objectType: 'some-invalid-value',
      } as unknown as AtomicOperation;

      const output = fn(atomicOperation);

      expect(output).toBe(false);
    });
  });
});

describe('isWalletAccountTransactionEntityCreateEcoupon', () => {
  it('returns true if an atomic operation is a walletAccountTransactionEntity for a new ECOUPON account', () => {
    const atomicOperation: WalletAccountTransactionEntity = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
          clientType: 'OFFER',
        },
      },
      operationType: 'CREATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityCreateEcoupon(atomicOperation);

    expect(output).toBe(true);
  });

  it('returns false if objectValue.account.type is not ECOUPON', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'some-other-type',
          clientType: 'OFFER',
        },
      },
      operationType: 'CREATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityCreateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });

  it('returns false if operationType is not CREATE', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
          clientType: 'OFFER',
        },
      },
      operationType: 'UPDATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityCreateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });

  it('returns false if clientType is not present', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
        },
      },
      operationType: 'CREATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityCreateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });
});

describe('isWalletAccountTransactionEntityUpdateEcoupon', () => {
  it('returns true if an atomic operation is a walletAccountTransactionEntity for an updated ECOUPON account', () => {
    const atomicOperation: WalletAccountTransactionEntity = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
          clientType: 'OFFER',
        },
      },
      operationType: 'UPDATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityUpdateEcoupon(atomicOperation);

    expect(output).toBe(true);
  });

  it('returns false if objectValue.account.type is not ECOUPON', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'some-other-type',
          clientType: 'OFFER',
        },
      },
      operationType: 'UPDATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityUpdateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });

  it('returns false if operationType is not UPDATE', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
          clientType: 'OFFER',
        },
      },
      operationType: 'CREATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityUpdateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });

  it('returns false if clientType is not present', () => {
    const atomicOperation = {
      objectType: 'walletAccountTransactionEntity',
      objectValue: {
        account: {
          type: 'ECOUPON',
        },
      },
      operationType: 'UPDATE',
    } as WalletAccountTransactionEntity;

    const output =
      isWalletAccountTransactionEntityUpdateEcoupon(atomicOperation);

    expect(output).toBe(false);
  });
});
