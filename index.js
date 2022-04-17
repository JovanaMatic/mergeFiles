const fs = require('fs');

const file1 = fs.readFileSync('./testFiles/Excluded2.csv', 'utf8');
const file2 = fs.readFileSync('./testFiles/OEM2.csv', 'utf8');

let mergedOBJ1 = [];
let VINsforFilter = [];
let fileWithUniqueVINs = [];


const createObject = (file) => {
    const objOne = [];
    const textArray = file.split(/\r\n|\r|\n/);
    const textHeader = textArray[0].split(',');


    for(let i = 0; i < textArray.length; i++) {
        const data = textArray[i].split(',')
        const myOBJ = {};
    
        for(let j = 0; j < data.length; j++) {
            myOBJ[textHeader[j]] = data[j]; 
        }
        objOne.push(myOBJ)
    }
    return objOne;
}
const mergeObjects = () => {
    
    const fileObj1 = createObject(file1);
    const fileObj2 = createObject(file2);
    

    fileObj1.shift();
    fileObj2.shift();
    

    fileObj1.map(item => {
        fileObj2.map(elem => {
            for(let prop in item) {
                for (let prop2 in elem) {
                    if(prop === 'vin') {
                        if((item[prop] === elem[prop2])) {
                            
                            mergedOBJ1.push(Object.assign(item, elem));
                            VINsforFilter.push(item[prop]);
                            
                         }else{
                             return;
                         }
                    }
                }
               
            }
        })
    });
    const toDelete = new Set(VINsforFilter);
    const newArray = fileObj2.filter(obj => !toDelete.has(obj.VIN));
    fileWithUniqueVINs.push(newArray);

    const newArray2 = fileObj1.filter(obj => !toDelete.has(obj.VIN));
    fileWithUniqueVINs = [...newArray2, ...newArray];
}
mergeObjects();

fs.writeFileSync('VINsfromBothFiles.json', JSON.stringify(mergedOBJ1), 'utf-8', (err) => {
        if(err) throw err;
        console.log('file saved');
});

fs.writeFileSync('uniqueVINsFile2.json', JSON.stringify(fileWithUniqueVINs), 'utf-8', (err) => {
    if(err) throw err;
    console.log('file saved');
});