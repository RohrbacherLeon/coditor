module.exports = {
    check(values, arrayCheck){
        errors = []
        Object.keys(values).forEach(key => {
            
            let value = values[key];
            let rules = arrayCheck[key].rules;
            let messages = arrayCheck[key].messages;

            rules.forEach((rule, index) => {
                if(rule in functions)
                    functions[rule](key, value,messages[index])
                else
                    console.log("erreur validator ligne 15");
                    
            })
        })
        
    },

    getErrors(){
        return errors;
    }
}

let errors = []

let functions = {

    required : (key, value, msg) => {
        if(value == ""){
            errors.push({key, msg});
        }
    },

    email : (key, value, msg) => {
        if(!value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i)){
            errors.push({key, msg});
        }
    }

}