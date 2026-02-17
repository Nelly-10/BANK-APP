"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { getBank, getBanks } from "./user.actions";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";


// GET MULTIPLE BANK ACCOUNTS!!
export const getAccounts = async ({ userId }: getAccountsProps) => {
    try {
        // GET BANKS FROM DB
        const banks = await getBanks({ userId });

        const accounts = await Promise.all(
            banks?.map(async (bank: Bank) => {
                // get each account info from plaid
                const accountsResponse = await plaidClient.accountsGet({
                    access_token: bank.accessToken,
                });
                const accountData = accountsResponse.data.accounts[0];

                // get institution info from plaid
                const institution = await getInstitution({
                    institutionId: accountsResponse.data.item.institution_id!,
                });

                const account = {
                    id: accountData.account_id,
                    availableBalance: accountData.balances.available!,
                    currentBalance: accountData.balances.current!,
                    institutionId: institution.institution_id,
                    name: accountData.name,
                    officialName: accountData.official_name,
                    mask: accountData.mask!,
                    type: accountData.type as string,
                    subtype: accountData.subtype! as string,
                    appwriteItemId: bank.$id,
                    sharaebleId: bank.shareableId,
                };

                return account;
            })
        );



        // const totalBanks = accounts.length;
        // const totalCurrentBalance = accounts.reduce((total, account) => {
        //     return total + account.currentBalance;
        // }, 0);

        return parseStringify({ data: accounts });

    } catch (error) {
        console.error("An error occurred while getting the accounts:", error);
    }
}

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
    try {
        // get bank from db
        const bank = await getBank({ documentId: appwriteItemId });

        // get account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get transfer transactions from appwrite

        // const transferTransactionsData = await getTransactionsByBankId({
        //     bankId: bank.$id,
        // });

        // const transferTransactions = transferTransactionsData.documents.map(
        //     (transferData: Transaction) => ({
        //         id: transferData.$id,
        //         name: transferData.name!,
        //         amount: transferData.amount!,
        //         date: transferData.$createdAt,
        //         paymentChannel: transferData.channel,
        //         category: transferData.category,
        //         type: transferData.senderBankId === bank.$id ? "debit" : "credit",
        //     })
        // );

        // get institution info from plaid

        // const institution = await getInstitution({
        //     institutionId: accountsResponse.data.item.institution_id!,
        // });

        // const transactions = await getTransactions({
        //     accessToken: bank?.accessToken,
        // });

        const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            // institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
        };

        return parseStringify({
            data: account,
            // transactions: allTransactions,
        });


    } catch (error) {

    }
}


// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};