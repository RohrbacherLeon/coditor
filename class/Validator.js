let {isEmail} = require('./Helper');
module.exports = {

    /**
     * Method of calling functions according to the rules applied 
     * @param {Object} values - Values to check
     * @param {Object} arrayCheck - object with the different rules and their messages
     */
    check(values, arrayCheck){
        let errors;
        Object.keys(values).forEach(key => {
            
            const value = values[key];
            const rules = arrayCheck[key].rules;
            const messages = arrayCheck[key].messages;
            let variables = null;

            errors = rules.reduce((acc, rule, index) => {

                if(rule.split(':').length > 1){
                    variables = parseInt(rule.split(':')[1])
                    rule = rule.split(':')[0]
                }

                if(rule in functions){
                    let error = functions[rule](key, value,messages[index], variables);
                    
                    if (!error) {
                        return acc;
                    }
                    return acc.concat(error);
                }
            }, []);
        })
        return errors;
    }
}

const functions = {

    required : (key, value, msg, variables) => {
        if(value === ""){
            return {key, msg};
        }
    },

    email : (key, value, msg, variables) => {
        if(!isEmail(value)){
            return {key, msg}
        }
    },

    min : (key, value, msg, variables) => {
        if(value.length < variables){
            return {key, msg}
        }
    }

}