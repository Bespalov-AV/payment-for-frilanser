const PaymentClass = function () {
  this.tableHeader = {
    'date': 'Дата',
    'summa': 'Сумма',
    'client': 'Клиент',
    'comment': 'Комментарий',
  };
  this.emptyLine = {
    date: new Date(),
    summa: 0,
    client: '',
    comment: ''
  };

  //this.Data = [];

  this.setStorage = () => {
    chrome.storage.sync.set({"pymentData": this.Data});
    //localStorage["pymentData"] = JSON.stringify(this.Data);
  };

  this.getStorage = () => {
       chrome.storage.sync.get(["pymentData"], (result) => {
        const Data = result.pymentData;
        this.fullTable(Data);
       });
      /*if (localStorage["pymentData"]) {
        this.Data = JSON.parse(localStorage["pymentData"]);
      }*/
  };

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("changes.pymentData");
    console.log(changes);
    this.Data = changes.pymentData.slice(0);
  });

  this.fullTable = (Data) => {
    this.addTableHeader();
    console.log(' .fullTable');
    console.log(Data);
    if (Data) {
    Data.forEach(element => {
      console.log(element);
      this.addNewRow(element);
    });
  }
  };

  this.getDataFromTable = () => {
    const table = this.table;
   // this.Data = Array();
    for (let row=1; row < table.rows.length; row++) 
      {
        const itRow = table.rows[row];
        const itData = {};
        for (let cell=0; cell < itRow.cells.length; cell++) 
        {
          const itCell = itRow.cells[cell];
          const cildNode = itCell.childNodes[0];
          if (cildNode.nodeName == 'INPUT') {
            itData[cildNode.name] = cildNode.value
          } else {
            itData[cildNode.name] = cildNode.textContent;
          }
        }
        this.Data.push(itData);
      }
  };

  this.addTableHeader = () => {
    const header = this.table.createTHead();
    const row = header.insertRow(0);    
    for (const key in this.tableHeader) {
      row.insertCell().textContent = this.tableHeader[key];
    }
  }

  this.addNewRow = (element) => {
      const row = this.table.insertRow();
      row.insertCell(0).appendChild(this.addInput(element.date, 'date', 'date', 'input-date'));
      row.insertCell(1).appendChild(this.addInput(element.summa, 'number', 'summa', 'input-summa'));
      row.insertCell(2).appendChild(this.addInput(element.client, 'text', 'client', 'input-client'));
      row.insertCell(3).appendChild(this.addInput(element.comment, 'text', 'comment', 'input-comment'));
  };

this.addInput = (value, type, name, className) =>  {
  input = document.createElement('input');
  input.setAttribute("type", type);
  input.setAttribute("name", name);
  input.value = value;
  input.valueAsDat = value;
  input.classList.add(className);

  return input;
};

  this.addButtonAdd = (div, className) =>  {
    btn = document.createElement('button');
    btn.classList.add(className);
    btn.name = 'ButtonAdd';
    btn.innerText = 'Добавить запись';

    btn.addEventListener('click', (env) => {
      this.addNewRow (this.table, this.emptyLine);
    });

    div.appendChild(btn);
  };

  this.addButtonSave = (div, className) =>  {
    btn = document.createElement('button');
    btn.classList.add(className);
    btn.name = 'ButtonSave';
    btn.innerText = 'Сохранить';

    btn.addEventListener('click', (env) =>  {
      this.getDataFromTable();
      this.setStorage();
    });

    div.appendChild(btn);
  };
};
