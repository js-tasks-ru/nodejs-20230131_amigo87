const Validator = require('../Validator');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator: конструктор - инициализация', () => {

    it('валидатор выбрасывает исключение, если правило имеет тип отличный от "object"', () => {
      assert.throws(() => new Validator(NaN), 'Type of rules is not an object');
    });

    it('валидатор выбрасывает исключение, если свойства правила проверки отличны от: type,min,max - #1', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: 0, maxs: 10 } }), 'Rule with key name must has props: type,min,max');
    });
    it('валидатор выбрасывает исключение, если свойства правила проверки отличны от: type,min,max - #2', () => {
      assert.throws(() => new Validator({ name: { type: 'string' } }), 'Rule with key name must has props: type,min,max');
    });
    it('валидатор выбрасывает исключение, если помимо свойств: type,min,max встречаются другие свойства', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: 0, max: 10, maxs: 10 } }), 'Rule with key name contains unknown props');
    });
    it('валидатор выбрасывает исключение, если в свойстве type указан другой тип', () => {
      assert.throws(() => new Validator({ name: { type: 'something', min: 0, max: 10 } }), 'Rule with key name must be: string or number');
    });
    it('валидатор выбрасывает исключение, если в свойстве min указано не числовое значение', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: '', max: 10 } }), 'Rule with key name must has min proprty with type "number"');
    });
    it('валидатор выбрасывает исключение, если в свойстве max указано не числовое значение', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: 0, max: undefined } }), 'Rule with key name must has max proprty with type "number"');
    });
    it('валидатор выбрасывает исключение, если значение свойства max меньше значения свойства min', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: 10, max: 0 } }), 'Rule with key name must has max proprty greater then min property');
    });
    it('валидатор выбрасывает исключение, если значение свойства min меньше нуля для строки', () => {
      assert.throws(() => new Validator({ name: { type: 'string', min: -5, max: 5 } }), 'Rule with key name have string string type and must have min value >= 0');
    });
  });

  describe('Validator: проверка передаваемого объекта для валидации', () => {
    
    it('валидатор выбрасывает исключение, если ему передан не объект', () => {
      const validator = new Validator({ name: { type: 'string', min: 0, max: 10 } });
      const errors = validator.validate(Number(1));

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect Object for validate, got number');
    });

    it('валидатор проверяет наличие свойства, указанного в rules - #1', () => {
      const validator = new Validator({ name: { type: 'string', min: 10, max: 20 } });
      const errors = validator.validate({ names: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('Object has no property name');
    });
    
    it('валидатор проверяет наличие свойства, указанного в rules - #2', () => {
      const validator = new Validator({ name: { type: 'string', min: 10, max: 20 } });
      const errors = validator.validate({ name: 'Lalalalalala' });

      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет тип анализируемого свойства', () => {
      const validator = new Validator({ name: { type: 'string', min: 10, max: 20 } });
      const errors = validator.validate({ name: 2 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect prop type to be string, got number');
    });
    

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({ name: { type: 'string', min: 3, max: 5 } });
      let errors = validator.validate({ name: 'La' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 3, got 2');
      
      errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
    });
    
    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({ age: { type: 'number', min: 3, max: 5 } });
      let errors = validator.validate({ age: 2 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 3, got 2');
      
      errors = validator.validate({ age: 6 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 5, got 6');
    });
  });

    


  
});