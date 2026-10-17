/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    theme?: string;
    styles?: any;
    headStyles?: any;
    columnStyles?: any;
  }
  
  declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: AutoTableOptions) => void;
      lastAutoTable?: {
        finalY: number;
      };
    }
  }
}
