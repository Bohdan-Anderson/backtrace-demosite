import './style.css'


type MatrixCell = {value:number,reason:string[]};

function minimumEditDistance(str1:string, str2:string): {distance: number, matrix: MatrixCell[][]}{

  const m = str1.length;
  const n = str2.length;

  // Initialize the matrix
  const matrix = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill({value:0,reason:[]}));

  // Fill the matrix
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      
      // basics
      if (i === 0 && j === 0) {
        matrix[i][j] = {value:0,reason:[]};
      } else if (i === 0) {
        matrix[i][j] = {value:j,reason:[]};
      } else if (j === 0) {
        matrix[i][j] = {value:i,reason:[]};
      } else {
        // Is it a delete
        const del = matrix[i][j - 1].value + 1;

        // Is it an insert
        const ins = matrix[i - 1][j].value + 1;

        // Is it a replace
        let rep = 0;
        if(str1[i-1] === str2[j-1]){
          rep = matrix[i - 1][j - 1].value;
        } else {
          rep = matrix[i - 1][j - 1].value + 2;
        }

        // matrix[i][j] = Math.min(del, ins, rep);
        matrix[i][j] = {value:Math.min(del, ins, rep),reason:[]};
        if(matrix[i][j].value === ins) matrix[i][j].reason.push('↑');
        if(matrix[i][j].value === del) matrix[i][j].reason.push('←');
        if(matrix[i][j].value === rep) matrix[i][j].reason.push('↖︎');
      }
    }
  }

  // Get the minimum edit distance
  const distance = matrix[m][n];

  return {
    distance,
    matrix,
  };
}


function maximumEditDistance(str1:string, str2:string): {distance: number, matrix: MatrixCell[][]}{
  const m = str1.length;
  const n = str2.length;

  // Initialize the matrix
  const matrix = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill({value:0,reason:[]}));
  
  // Fill the matrix
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
        
        // basics
        if (i === 0 && j === 0) {
          matrix[i][j] = {value:0,reason:[]};
        } else if (i === 0) {
          matrix[i][j] = {value:0,reason:[]};
        } else if (j === 0) {
          matrix[i][j] = {value:0,reason:[]};
        } else {
          const reason = [];
          // Is it a delete
          const del = matrix[i][j - 1].value - 1;
  
          // Is it an insert
          const ins = matrix[i - 1][j].value - 1;
  
          // Is it a replace
          let rep = 0;
          if(str1[i-1] === str2[j-1]){
            rep = matrix[i - 1][j - 1].value + 1;
            reason.push('↖︎');
          } else {
            rep = matrix[i - 1][j - 1].value - 1;
          }
  
          // matrix[i][j] = Math.min(del, ins, rep);
          matrix[i][j] = {value:Math.max(del, ins, rep),reason};
        }
    }
  }

  // Get the maximum edit distance
  const distance = matrix[m][n];

  return {
    distance,
    matrix,
  };
};

const createTable = (matrix: MatrixCell[][],str1:string, str2:string) => {
  // matrix to table
  const table = document.createElement("table");
  table.classList.add("striped");
  table.style.border = "1px solid black";
  table.style.borderCollapse = "collapse";

  // for each letter in str1 add a column
  const headerRow = document.createElement("tr");
  const headerCell = document.createElement("th");
  headerRow.appendChild(headerCell);
  for (let i = 0; i < str1.length; i++) {
    const headerCell = document.createElement("th");
    headerCell.textContent = str1[i];
    headerRow.appendChild(headerCell);
  }
  table.appendChild(headerRow);


  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.textContent = str2[i];
    row.appendChild(headerCell);

    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement("td");
      cell.innerHTML = matrix[i][j].reason.join(",") + (matrix[i][j].reason.length?'<br>':'') + matrix[i][j].value;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  const tableContainer = document.querySelector<HTMLDivElement>("#table");
  if(!tableContainer) throw new Error("table container not found");
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}


const generate = () => {
  // Example usage
  const str1 =(document.getElementById("string1") as HTMLInputElement).value || "execution";
  const str2 = (document.getElementById("string2") as HTMLInputElement).value || "intention";
  const result = minimumEditDistance(str1, str2);
  createTable(result.matrix,"#"+str1,"#"+str2);
}

let button = document.querySelector<HTMLButtonElement>("#generate");
if(!button) throw new Error("button not found");
button.addEventListener("click",generate);

const generateMax = () => {
  // Example usage
  const str1 =(document.getElementById("string1") as HTMLInputElement).value || "execution";
  const str2 = (document.getElementById("string2") as HTMLInputElement).value || "intention";
  const result = maximumEditDistance(str1, str2);
  createTable(result.matrix,"#"+str1,"#"+str2);
};

button = document.querySelector<HTMLButtonElement>("#generate-max");
if(!button) throw new Error("button not found");
button.addEventListener("click",generateMax);


const defaults = () => {
  (document.getElementById("string1") as HTMLInputElement).value = "execution";
  (document.getElementById("string2") as HTMLInputElement).value = "intention";
  generate();
}
button = document.querySelector<HTMLButtonElement>("#button-default");
if(!button) throw new Error("button not found");
button.addEventListener("click",defaults);

const bohdanExample = () => {
  (document.getElementById("string1") as HTMLInputElement).value = "bohdan";
  (document.getElementById("string2") as HTMLInputElement).value = "bo dan";
  generate();
}
button = document.querySelector<HTMLButtonElement>("#button-bohdan");
if(!button) throw new Error("button not found");
button.addEventListener("click",bohdanExample);


