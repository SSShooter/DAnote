Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}
//创建上传列表
	if(!localStorage.getItem('uploadList')){
		var uploadList = [];
		localStorage.setItem('uploadList', JSON.stringify(uploadList));
	}
//更新上传列表(增)
	function addToUpload(diary_id){
		//打开上传列表
		var uploadList = JSON.parse(localStorage.getItem('uploadList'));
		if(!uploadList.contains(diary_id)){
			uploadList.push(diary_id);
			localStorage.setItem('uploadList', JSON.stringify(uploadList));
		}
	}
//更新上传列表(减)(上传)
	function uploadData(cb){
		//打开上传列表
		var uploadList = JSON.parse(localStorage.getItem('uploadList'));
		var length = uploadList.length;
		if(length){
			for(var i=0;i<length;i++){
				var uploadId = uploadList.shift();
				//同步ajax
				console.log("上传"+uploadId);
				cb(uploadId);
				localStorage.setItem('uploadList', JSON.stringify(uploadList));
			}
		}
		else{
			api.toast({
		        msg:'没有新数据哦'
	        });
		}
	}