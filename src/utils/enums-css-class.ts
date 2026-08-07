export function getInvoiceStatusClass(status?: string) {
  return {
    'invoice-status-paid': status === 'PAID',
    'invoice-status-partial': status === 'PARTIAL',
    'invoice-status-delay': status === 'DELAY',
    'invoice-status-pending': status === 'PENDING',
  };
}

export function getAgingClass(aging?: string) {
  return {
    'aging-zero-thirty': aging == 'ZERO_THIRTY',
    'aging-thirty-sixty': aging == 'THIRTY_SIXTY',
    'aging-sixty-ninty': aging == 'SIXTY_NINTY',
    'aging-ninty-plus': aging == 'NINTY_PLUS',
    'aging-not-yet-due': aging == 'NOT_YET_DUE',
    'aging-paid': aging == 'PAID',
    'aging-na': aging == 'NA',
  };
}
