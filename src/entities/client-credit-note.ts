import { Configs } from '@/types/entity-configs';
import { ClientInvoiceSortField } from '@/types/client-invoice-type';
import { formatCurrency, formatPercentage } from '@/utils/validation';
import { ClientCreditNoteType } from '@/types/client-credit-note-type';
import { ClientInvoice } from './client-invoice';

export class ClientCreditNote {
  static getConfigs(): Configs<ClientInvoiceSortField, ClientCreditNoteType> {
    const invoiceConfigs = ClientInvoice.getConfigs([], []);

    const creditNoteConfigs = Object.fromEntries(
      Object.entries(invoiceConfigs).map(([key, config]) => [
        key,
        {
          ...config,
          styleConfig: {
            ...config.styleConfig,
            showDisabled: () => true,
            isInvalid: () => false,
          },
          displayValue: () => '---',
        },
      ]),
    ) as Configs<ClientInvoiceSortField, ClientCreditNoteType>;

    return {
      ...creditNoteConfigs,
      docNumber: {
        ...creditNoteConfigs.docNumber,
        styleConfig: {
          ...creditNoteConfigs.docNumber.styleConfig,
          showDisabled: () => false,
          isInvalid: (creditNoteType: ClientCreditNoteType) => !creditNoteType.docNumber,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => creditNoteType.docNumber,
      },
      description: {
        ...creditNoteConfigs.description,
        styleConfig: {
          ...creditNoteConfigs.description.styleConfig,
          showDisabled: () => false,
          isInvalid: (creditNoteType: ClientCreditNoteType) => !creditNoteType.description,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => creditNoteType.description,
      },
      valueWithoutTax: {
        ...creditNoteConfigs.valueWithoutTax,
        styleConfig: {
          ...creditNoteConfigs.valueWithoutTax.styleConfig,
          showDisabled: () => false,
          isInvalid: (creditNoteType: ClientCreditNoteType) => !creditNoteType.valueWithoutTax,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => formatCurrency(creditNoteType.valueWithoutTax),
      },
      appliedTax: {
        ...creditNoteConfigs.appliedTax,
        styleConfig: {
          ...creditNoteConfigs.appliedTax.styleConfig,
          showDisabled: () => false,
          isInvalid: (creditNoteType: ClientCreditNoteType) =>
            creditNoteType.appliedTax == undefined || creditNoteType.appliedTax < 0,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => formatPercentage(creditNoteType.appliedTax),
      },
      taxValue: {
        ...creditNoteConfigs.taxValue,
        displayValue: (creditNoteType: ClientCreditNoteType) => formatCurrency(creditNoteType.taxValue),
      },
      totalValue: {
        ...creditNoteConfigs.totalValue,
        displayValue: (creditNoteType: ClientCreditNoteType) => formatCurrency(creditNoteType.totalValue),
      },
      registrationDate: {
        ...creditNoteConfigs.registrationDate,
        styleConfig: {
          ...creditNoteConfigs.registrationDate.styleConfig,
          showDisabled: () => false,
          isInvalid: (creditNoteType: ClientCreditNoteType) => !creditNoteType.registrationDate,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => creditNoteType.registrationDate,
      },
      dueDate: {
        ...creditNoteConfigs.dueDate,
        styleConfig: {
          ...creditNoteConfigs.dueDate.styleConfig,
          showDisabled: () => false,
          isInvalid: () => false,
        },
        displayValue: (creditNoteType: ClientCreditNoteType) => creditNoteType.dueDate,
      },
    };
  }

  static isValid(clientCreditNoteType: ClientCreditNoteType, configs: Configs<ClientInvoiceSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientCreditNoteType));
  }
}
