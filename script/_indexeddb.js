var dadb = {
   name:'disannoy'
};
initDB();
function initDB() {//初始化数据库
   dadb.version = dadb.version || 1;
   var request = indexedDB.open(dadb.name, dadb.version);
   request.onerror = function (e) {
      console.log(e.currentTarget.error.message);
   };
   request.onsuccess = function (e) {
      dadb.db = e.target.result;
   };
   request.onupgradeneeded = function (e) {
      var thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains("diary")) {
         var objStore = thisDB.createObjectStore("diary", {keyPath: "id", autoIncrement: true});
         objStore.createIndex("create_date", "create_date", {unique: false});
         objStore.createIndex("modify_date", "modify_date", {unique: false});
      }
   };
}
function closeDB() {
   dadb.db.close();
}
function deleteDB() {
   indexedDB.deleteDatabase(dadb.name);
}
function addData(data, cb) {//添加数据
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var request = objectStore.add(data);
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : data
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}
function addmData(mdata, cb) {//批量添加数据
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   for(var c = 0;c<mdata.length;c++){
      var request = objectStore.add(mdata[c]);
      request.onerror = function (e) {
         if (cb) {
            cb({
               error: 1
            })
         }
      }
   }
}
function deleteData(id, cb) {//删除数据
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var request = objectStore.delete(parseInt(id));
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : parseInt(id)
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}
function getDataAll(cb) {//获取全部数据
   var transaction = dadb.db.transaction("diary", 'readonly');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var rowData = [];
   objectStore.openCursor(IDBKeyRange.lowerBound(0)).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor && cb) {
         cb({
            error: 0,
            data : rowData
         });
         return;
      }
      rowData.push(cursor.value);
      cursor.continue();
   };
}

function getDataById(id, cb) {//根据id获取数据
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };

   var objectStore = transaction.objectStore("diary");
   var request = objectStore.get(id);
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : e.target.result
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}
function getDataBySearch(keywords, cb) {//
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };

   var objectStore = transaction.objectStore("diary");
   var boundKeyRange = IDBKeyRange.only(keywords);
   var rowData;
   objectStore.index("nickName").openCursor(boundKeyRange).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor) {
         if (cb) {
            cb({
               error: 0,
               data : rowData
            })
         }
         return;
      }
      rowData = cursor.value;
      cursor.continue();
   };
}
function getDataByPager(start, end, cb) {
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };

   var objectStore = transaction.objectStore("diary");
   var boundKeyRange = IDBKeyRange.bound(start, end, false, true);
   var rowData = [];
   objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor && cb) {
         cb({
            error: 0,
            data : rowData
         });
         return;
      }
      rowData.push(cursor.value);
      cursor.continue();
   };
}
function updateData(id, updateData, cb) {
   var transaction = dadb.db.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };

   var objectStore = transaction.objectStore("diary");
   var request = objectStore.get(id);
   request.onsuccess = function (e) {
      var thisDB = e.target.result;
      for (key in updateData) {
         thisDB[key] = updateData[key];
      }
      objectStore.put(thisDB);
      if (cb) {
         cb({
            error: 0,
            data : thisDB
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}
