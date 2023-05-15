const app = require('../app');
const request = require('supertest');
const assert = require('assert');

/*
* 1 - for digit in the string
* x - for any non-digit character in the string
* / - for slash character
*   - for space character
*/

describe('Credit card validation API Variables', function () {

    describe('POST /validate', function () {
        it('should return an error when all the variables are empty.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '',
                    cvc: '',
                    name: '',
                    type: '',
                    pan: '',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    assert.equal(res.body.errors.cardNumber, 'Please enter a valid card number.');
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    assert.equal(res.body.errors.cardType, 'Please enter a valid card.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when only the expiry variable is empty.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4111 1111 4555 1142',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when only the cvc variable is empty.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '062023',
                    cvc: '',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4111 1111 4555 1142',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when only the type variable is empty.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '062023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: '',
                    pan: '4111 1111 4555 1142',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardType, 'Please enter a valid card.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when only the pan variable is empty.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '062023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Please enter a valid card number.');
                    done();
                });
        });
    });
});

describe('Credit card validation API CardNumber', function () {
    describe('POST /validate', function () {
        it('should return an error when the pan is not only a string of numbers. (xx)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: 'test',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Please enter a valid card number.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when the pan is not only a string of numbers. (x1)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: 'test123',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Please enter a valid card number.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card number is not between 16 to 19 digits.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '12121',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Card number must be 16 to 19 digits long.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card type is Amex but its not 15 digits.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '1234567891234577',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Card number must be 15 digits long.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card type is Amex but the first 2 digits are not "32" or "37".', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '123456789123456',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Card number must start with 34 or 37 for Amex.');
                    done();
                });
        });
    });
    describe('POST /validate', function () {
        it('should return an error when Luhn algorithm fails.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardNumber, 'Invalid card number.');
                    done();
                });
        });
    });
});

describe('Credit card validation API CVC', function () {
    describe('POST /validate', function () {
        it('should return an error when card type is Amex but the cvc isnt 4 digits.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'CVC must be 4 digits.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card type its not Amex and cvc isnt 3 digits.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '1234',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'CVC must be 3 digits.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (1x1x).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '1m3m',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (1xx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '1mm',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });
    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (xxxx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: 'mmmm',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (xxx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: 'mmm',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (11x).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '11m',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when cvc is not only a string of numbers (111x).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '111m',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardCvcCode, 'Please enter a valid CVC code.');
                    done();
                });
        });
    });

});

describe('Credit card validation API Expiry Date', function () {

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (1)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '1',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly.(11)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly.( 1)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: ' 1',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. ( 12)', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: ' 12',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (11/).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (xx/xx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: 'mm/yy',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (xx/xxxx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: 'mm/yyyy',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (xx/1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: 'mm/2023',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (xx/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: 'mm/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (11/xx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/yy',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (11/xxxx).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/yyyy',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (1x/1x).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '1m/2y',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Please enter a valid date.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (11/1).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/1',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card expiration date must be in the format MM/YY, MM/YYYY, MMYY or MMYYYY.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (11/111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/199',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card expiration date must be in the format MM/YY, MM/YYYY, MMYY or MMYYYY.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. (  /11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '  2/19',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card expiration date must be in the format MM/YY, MM/YYYY, MMYY or MMYYYY.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when date is not filled properly. ( 2/111)." ', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: ' 2/199',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card expiration date must be in the format MM/YY, MM/YYYY, MMYY or MMYYYY.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when month is not filled properly (-1/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '-1/25',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card month must be between 1 and 12.');
                    done();
                });
        });
    });
    describe('POST /validate', function () {
        it('should return an error when month is not filled properly (11/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '13/25',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card month must be between 1 and 12.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when card expiry year is longer than the limit (11/1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '04/2031',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card year must be between some months and 7 years from now.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card expiry year is longer than the limit (11/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '04/31',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card year must be between some months and 7 years from now.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card expiry year is longer than the limit (1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '0431',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card year must be between some months and 7 years from now.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when card expiry year is longer than the limit (111111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '042031',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card year must be between some months and 7 years from now.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when card is outdated (11/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/22',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card is outdated (11/11).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '04/23',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return an error when card is outdated (11/1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2022',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card is outdated (11/1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '04/2023',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });



    describe('POST /validate', function () {
        it('should return an error when card is outdated (1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '0423',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card is outdated (1111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: ' 1219',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return an error when card is outdated (111111).', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '122019',
                    cvc: '123',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '3734567891234567',
                })
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.errors.cardExpiryDate, 'Card is outdated');
                    done();
                });
        });
    });

});

describe('Credit card Positive Tests', function () {
    //VISA 

    describe('POST /validate', function () {
        it('should return ok when visa card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '1223',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4111 1111 4555 1142',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when visa card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '122023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4111 1120 1426 7661',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when visa card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/23',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4988 4388 4388 4305',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when visa card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'visa',
                    pan: '4166 6766 6766 6746',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    // AMERICAN EXPRESS 
    describe('POST /validate', function () {
        it('should return ok when Amex card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '03/2025',
                    cvc: '6668',
                    name: 'David Coimbra',
                    type: ' aMerican-express',
                    pan: '3700 0000 0000 002', // American express is 15 digits but task implied between 16 and 19
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when Amex card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '03/2025',
                    cvc: '7373',
                    name: 'David Coimbra',
                    type: 'american-express',
                    pan: '3700 0000 0100 018', // American express is 15 digits but task implied between 16 and 19
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    // MASTERCARD 
    describe('POST /validate', function () {
        it('should return ok when mastercard card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'mastercard',
                    pan: '2222 4000 7000 0005',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when mastercard card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'mastercard',
                    pan: '5555 3412 4444 1115',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });

    describe('POST /validate', function () {
        it('should return ok when mastercard card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'mastercard',
                    pan: '5577 0000 5577 0004',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });


    describe('POST /validate', function () {
        it('should return ok when mastercard card is valid.', function (done) {
            request(app)
                .post('/validate')
                .send({
                    expiry: '12/2023',
                    cvc: '737',
                    name: 'David Coimbra',
                    type: 'mastercard',
                    pan: '5555 4444 3333 1111',
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, 'Card is valid.');
                    done();
                });
        });
    });
});
