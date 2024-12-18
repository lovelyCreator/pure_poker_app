export function centsToDollars(cents: number): string {
    return (cents / 100).toFixed(2);
  }
  
  export function dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }
  