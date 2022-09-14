import * as d3 from "d3";

export const readAccountIds = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const accounts: string[] = [];
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target?.result?.toString();
        if (text !== null && text !== undefined) {
          const data = d3.csvParse(text);
          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (typeof row.Account === 'string') {
              accounts.push(row.Account);
            } else if (typeof row.account === 'string') {
              accounts.push(row.account);
            } else {
              reject('CSV file is not valid: Missing a column with the name Account');
              return;
            }
          }
        }
  
        resolve(accounts);
      };
      reader.readAsText(file);
    });
  }