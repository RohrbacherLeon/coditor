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

            errors = rules.reduce((acc, rule, index) => {

                const [ruleName, ...variables] = rule.split(':');

                if(ruleName in functions){
                    let error;
                    if(variables){
                        error = functions[ruleName](key, value,messages[index], variables);
                    }else{
                        error = functions[ruleName](key, value,messages[index]);
                    }
                    
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

function isEmail(value) {
    if(value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i)){
        return true;
    }
    return false;
}