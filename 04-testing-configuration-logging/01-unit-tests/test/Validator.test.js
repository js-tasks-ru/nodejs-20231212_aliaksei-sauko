const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    //
    // validate values

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    // tests naming: 'what we check, function name - input description - expected result'
    it('validate - a value that exceeds the maximum field length - error "too long"', () => {
      // arrange
      const rules = {
        name: { type: 'string', min: 8, max: 38 }
      };
      const validator = new Validator(rules);

      const name39Chars = 'Salvador Felipe Jacinto Dalí y Domenech';
      const objToValidate = { name: name39Chars };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `too long, expect ${rules.name.max}, got ${name39Chars.length}`
        );
    });

    it('validate - a value in a range - no errors', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 35 }
      };
      const validator = new Validator(rules);

      // act
      const errors = validator.validate({ age: 21 });

      // assert
      expect(errors).to.empty;
    });

    it('validate - a value is less than the range - error "too little"', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 35 }
      };
      const validator = new Validator(rules);

      // act
      const errors = validator.validate({ age: 20 });

      // assert
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too little, expect 21, got 20');
    });

    it('validate - a value that exceeds the range - error "too big"', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 35 },
      };
      const validator = new Validator(rules);
      const objToValidate = { age: 36 };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `too big, expect ${rules.age.max}, got ${objToValidate.age}`
        );
    });

    //
    // validate types

    it('validate string type - value with an incorrect type - incorrect type error message', () => {
      // arrange
      const rules = {
        name: { type: 'string', min: 8, max: 38 },
      };
      const validator = new Validator(rules);

      const objToValidate = { name: 38 };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `expect ${rules.name.type}, got ${typeof objToValidate.name}`
        );
    });

    it('validate number type - value with an incorrect type - incorrect type error message', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 36 },
      };
      const validator = new Validator(rules);

      const objToValidate = { age: '21' };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `expect ${rules.age.type}, got ${typeof objToValidate.age}`
        );
    });

    //
    // validator returns several errors

    it('validate - incorrect field type and incorrect length value - only first type error', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 30 },
        name: { type: 'string', min: 5, max: 38 },
      };
      const validator = new Validator(rules);

      const name39Chars = 'Salvador Felipe Jacinto Dalí y Domenech';
      const objToValidate = { age: '20', name: name39Chars };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(1);
      expect(errors).to.not.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `expect ${rules.age.type}, got ${typeof objToValidate.age}`
        );
    });

    it('validate - incorrect values of multiple fiels - array of the errors', () => {
      // arrange
      const rules = {
        age: { type: 'number', min: 21, max: 25 },
        name: { type: 'string', min: 5, max: 38 },
      };
      const validator = new Validator(rules);

      const name39Chars = 'Salvador Felipe Jacinto Dalí y Domenech';
      const objToValidate = { age: 20, name: name39Chars };

      // act
      const errors = validator.validate(objToValidate);

      // assert
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal(
          `too little, expect ${rules.age.min}, got ${objToValidate.age}`
        );

      expect(errors[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors[1])
        .to.have.property('error')
        .and.to.be.equal(
          `too long, expect ${rules.name.max}, got ${name39Chars.length}`
        );
    });
  });
});
