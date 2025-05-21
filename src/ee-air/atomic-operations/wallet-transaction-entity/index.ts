import {getTransactionAttributesFromWalletTransactionEntityUpdate} from './update-settle';
import {getTransactionAttributesFromWalletTransactionEntityCreateFulfil} from './create-fulfil';
import {getTransactionAttributesFromWalletTransactionEntityCreatRefund} from './create-refund';
import {getTransactionAttributesFromWalletTransactionEntityUpdateSpend} from './update-spend';
import {getTransactionAttributesFromWalletTransactionEntityUpdateSpendVoid} from './update-spend-void';

const UpdateSettleSettled = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityUpdate,
};

const UpdateSettleFulfilling = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityUpdate,
};

const UpdateSpend = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityUpdateSpend,
};

const UpdateSpendVoid = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityUpdateSpendVoid,
};

const CreateFulfilFulfilled = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityCreateFulfil,
};

const CreateRefundSettled = {
  getTransactionAttributes:
    getTransactionAttributesFromWalletTransactionEntityCreatRefund,
};

export default {
  UpdateSettleSettled,
  UpdateSettleFulfilling,
  UpdateSpend,
  UpdateSpendVoid,
  CreateFulfilFulfilled,
  CreateRefundSettled,
};
