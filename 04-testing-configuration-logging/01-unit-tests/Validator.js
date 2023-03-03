module.exports = class Validator {
  constructor(rules) {
    // проверка типа для правил

    if (typeof rules != "object"){
      throw new Error('Type of rules is not an object');
    }
    
    // в каждом правиле должны присутствовать 3 свойства: type, min, max
    const expect_props = ['type', 'min', 'max'];
    for (const field of Object.keys(rules)) {
      let common = Object.keys(rules[field]).filter(x => expect_props.indexOf(x) !== -1) 

      if (common.length < expect_props.length){
        throw new Error(`Rule with key ${field} must has props: ${expect_props}`);
      }
      if (Object.keys(rules[field]).length > expect_props.length){
        throw new Error(`Rule with key ${field} contains unknown props`);
      }
      if (['string', 'number'].indexOf(rules[field].type) === -1){
        throw new Error(`Rule with key ${field} must be: string or number`);
      }
      if (typeof rules[field].min != 'number') {
        throw new Error(`Rule with key ${field} must has min proprty with type "number"`);
      }
      if (typeof rules[field].max != 'number') {
        throw new Error(`Rule with key ${field} must has max proprty with type "number"`);
      }
      if (rules[field].max < rules[field].min) {
        throw new Error(`Rule with key ${field} must has max proprty greater then min property`);
      }
      // для строки min > 0
      if ('string' == rules[field].type && rules[field].min < 0) {
        throw new Error(`Rule with key ${field} have string string type and must have min value >= 0`);
      }
    }

    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    // obj является объектом
    const obj_type = typeof obj;
    if (obj_type != "object"){
      errors.push({ error: `expect Object for validate, got ${obj_type}` });
      return errors;
    }
  
    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      // obj[field] есть
      if (!obj.hasOwnProperty(field)){
        errors.push({ error: `Object has no property ${field}`})
        return errors;
      }
      
      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({ field, error: `expect prop type to be ${rules.type}, got ${type}` });
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({ field, error: `too short, expect ${rules.min}, got ${value.length}` });
          }
          if (value.length > rules.max) {
            errors.push({ field, error: `too long, expect ${rules.max}, got ${value.length}` });
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({ field, error: `too little, expect ${rules.min}, got ${value}` });
          }
          if (value > rules.max) {
            errors.push({ field, error: `too big, expect ${rules.max}, got ${value}` });
          }
          break;
      }

      
    }

    return errors;
  }
};
