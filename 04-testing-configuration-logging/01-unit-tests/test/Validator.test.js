const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
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
  });
});