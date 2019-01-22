module.exports = {

    /**
     * Method of calling functions according to the rules applied 
     * @param {Object} values - Values to check
     * @param {Object} arrayCheck - object with the different rules and their messages
     */
    check(values, arrayCheck){
        errors = []
        Object.keys(values).forEach(key => {
            
            let value = values[key];
            let rules = arrayCheck[key].rules;
            let messages = arrayCheck[key].messages;
            let variables = null;

            rules.forEach((rule, index) => {

                if(rule.split(':').length > 1){
                    variables = parseInt(rule.split(':')[1])
                    rule = rule.split(':')[0]
                }

                if(rule in functions)
                    functions[rule](key, value,messages[index], variables)
                else
                    console.log("erreur validator ligne 15");
                    
            })
        })
        
    },

    /**
     * returns errors
     */
    getErrors(){
        return errors;
    }
}

let errors = []

let functions = {

    required : (key, value, msg, variables) => {
        if(value == ""){
            errors.push({key, msg});
        }
    },

    email : (key, value, msg, variables) => {
        if(!value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i)){
            errors.push({key, msg});
        }
    },

    min : (key, value, msg, variables) => {
        if(value.length < variables){
            errors.push({key, msg});
        }
    }

}