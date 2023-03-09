

class queryHandler {
    async queryWithoutPagination(query){
        if(Object.keys(query).length){
            let queryObj = {}
            for(let item in query){
                if(item == 'fromDate'){
                    const date = new Date(query['fromDate']).toISOString().split('T')[0] + "T00:00:00.000Z"
                    console.log("-=-=-=-=-=-=-=-=-==-",date);
                    queryObj['createdAt'] = {$gte: date}
                }
                if(item == 'toDate'){
                    var date = new Date(query['fromDate']).toISOString().split('T')[0] + "T00:00:00.000Z"
                    var date2 = new Date(query['toDate']).toISOString().split('T')[0] + "T23:00:00.000Z"
                    queryObj['createdAt'] = {
                        $gte: date,
                        $lt: date2
                    }
                }
                if(item != 'fromDate' && item != 'toDate'){
                    queryObj[item] = new RegExp('.*' + query[item] + '.*')
                }
            }
            return queryObj

        }
        else{
            return {}
        }
    }
}

export default new queryHandler();