/**
 * Check the validity of a credit card.
 *
 * @param {Object} req - The Express request object.
 * @param {string} req.body.pan - The card number. Must be a string of digits only.
 * @param {string} req.body.expiry - The card's expiry date in the format "mm/yy" or "mm/yyyy".
 * @param {string} req.body.cvc - The card's CVC code. Must be a string of 3 or 4 digits.
 * @param {string} req.body.name - The name of the cardholder as it appears on the card.
 * @param {string} req.body.type - The type of card. Must be one of "Visa", "Mastercard", "Amex"
 * @param {Object} res - The Express response object.
 */

class FormController {
  validateCardDetails(req, res) {
    const MAX_EXPIRY_YEAR = 7;
    const OFFSET_MONTH = 1;
    // Dates
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2);
    const currentYearLong = currentDate.getFullYear().toString();
    const currentMonth = currentDate.getMonth();
    // Card info (Let's trim the white spaces from the user input)
    const cardExpiryDate = req.body.expiry.trim();
    const cardExpiryDateLength = cardExpiryDate.length;
    // Let's take the white spaces out of the card number
    const cardNumber = req.body.pan.replace(/\s/g, '');
    const cardCvcCode = req.body.cvc.trim();
    const cardType = req.body.type.toLowerCase().trim();
    // Let's make this two let variables cause they will change how they will work depending on the user input
    // User input can be wrong e.g. "8" and split will break if there is not enough digits to reach the '/'
    let expiryMonth = "";
    let expiryYear = "";
    // This will store any errors that will occur, so we can return them to the user ;)
    const errors = {};

    // Check if the field card type is empty
    if (cardType.length === 0) {
      errors.cardType = "Please enter a valid card.";
    }

    /* CARD NUMBER VERIFICATIONS BEGIN---------*/

    //Check if the fields are empty & if they are numbers
    if (cardNumber.length === 0 || !Number(cardNumber)) {
      errors.cardNumber = "Please enter a valid card number.";
    }
    //Check if the card number is between 16 and 19 digits long (Note: Amex cards are 15 digits long)
    else if ((cardType == "american-express" && cardNumber.length !== 15) ||
      (cardType != "american-express" && (cardNumber.length < 16 || cardNumber.length > 19))) {
      errors.cardNumber = cardType == "american-express" ?
        "Card number must be 15 digits long." :
        "Card number must be 16 to 19 digits long.";
    }

    // Check if the card number starts with "34" or "37" for American Express cards
    else if (cardType == "american-express" && (cardNumber.slice(0, 2) != "34" && cardNumber.slice(0, 2) != "37")) {
      errors.cardNumber = "Card number must start with 34 or 37 for Amex.";
    } else {
      //* The PAN (card number) must pass the Luhn algorithm
      // Calculate the Luhn sum of the card number
      let luhnSum = 0;

      // Loop through the card number digits, starting from the rightmost digit
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        // For every other digit, double the value and subtract 9 if it's greater than 9
        if ((cardNumber.length - i) % 2 === 0) {
          digit *= 2;
          if (digit > 9) {
            digit = digit - 9;
          }
        }
        // Add the resulting digit to the Luhn sum
        luhnSum += digit;
      }

      // If the Luhn sum is not divisible by 10, the card number is invalid
      if (luhnSum % 10 !== 0) {
        errors.cardNumber = "Invalid card number.";
      }
    }

    /* CARD NUMBER VERIFICATIONS END---------*/

    /* CVC CODE VERIFICATIONS BEGIN---------*/

    // Check if the fields are empty & if they are numbers
    if (cardCvcCode.length === 0 || !Number(cardCvcCode)) {
      errors.cardCvcCode = "Please enter a valid CVC code.";
    }
    // Check whether the card type is selected and if the CVC code is 3 or 4 digits long
    else if (cardType == "american-express" && cardCvcCode.length != 4) {
      errors.cardCvcCode = "CVC must be 4 digits.";
    }
    else if (cardType != "american-express" && cardCvcCode.length != 3) {
      //* Check if the CVC code is exactly 3 digits long for non-American Express cards
      errors.cardCvcCode = "CVC must be 3 digits.";
    }

    /* CVC CODE VERIFICATIONS END---------*/

    /* EXPIRY DATE VERIFICATIONS BEGIN---------*/
    /*
    *We will check if the expiry date is in the 'MM/YY', 'MM/YYYY', 'MMYY', or 'MMYYYY' format. 
    *We will ignore formats such as 'MMM' and 'MMMM'. 
    *Note that some users of the API might not include the '/' character automatically when entering a 2-digit year, so the format 'MMYYYY' can be useful."
    */
    if (cardExpiryDate.includes('/')) {
      [expiryMonth, expiryYear] = cardExpiryDate.split('/').slice(-2);
    }
    else if (cardExpiryDateLength === 4) {
      expiryMonth = cardExpiryDate.substring(0, 2);
      expiryYear = cardExpiryDate.substring(2, 4);
    }
    else if (cardExpiryDateLength === 6) {
      expiryMonth = cardExpiryDate.substring(0, 2);
      expiryYear = cardExpiryDate.substring(2, 6);
    }

    const expiryYearLength = expiryYear.length;
    const expiryMonthLength = expiryMonth.length;

    /* EXPIRY DATE VERIFICATIONS BY ORDER */
    // Check if the expiry date fields are empty & if they are numbers
    if (!Number(expiryMonth) || !Number(expiryYear) || cardExpiryDate.length === 0) {
      errors.cardExpiryDate = "Please enter a valid date.";
    }
    // Check if the expiry date has the correct amount of digits
    else if (expiryMonthLength !== 2 || (expiryYearLength !== 2 && expiryYearLength !== 4)) {
      errors.cardExpiryDate = "Card expiration date must be in the format MM/YY, MM/YYYY, MMYY or MMYYYY.";
    }
    
    // Check if the month is between 1 and 12
    else if ((expiryMonth > 12 || expiryMonth < 1)) {
      errors.cardExpiryDate = "Card month must be between 1 and 12.";
    }
    /*
    *As noted on this page for testing cards (https://docs.adyen.com/development-resources/testing/test-card-numbers#mastercard), we will set the maximum expiry date limit at 7 years. 
    *Since we don't have the issue date for the credit cards, we will assume that they were issued on the current date and will expire in 7 years. 
    *Our condition will trigger if the expiry date is more than 7 years from now. 
    *Additionally, if we receive a 2-digit year such as '99', we will interpret it as '2099', while a 4-digit year will be interpreted as '1999'."
    */
    else if (expiryYearLength === 2 && ((expiryYear > (Number(currentYear) + MAX_EXPIRY_YEAR)))
      || expiryYearLength === 4 && (expiryYear > (Number(currentYearLong) + MAX_EXPIRY_YEAR))) {
      errors.cardExpiryDate = "Card year must be between some months and 7 years from now.";
    }
    else if (expiryYearLength === 2 && (expiryYear < currentYear || (expiryYear == currentYear && expiryMonth < currentMonth + OFFSET_MONTH))
      || expiryYearLength === 4 && (expiryYear < currentYearLong || (expiryYear == currentYearLong && expiryMonth < currentMonth + OFFSET_MONTH))) {
      errors.cardExpiryDate = "Card is outdated";
    }

    /* EXPIRY DATE VERIFICATIONS END---------*/


    // If there are any errors, return them to the frontend
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // If the card satisfies all the above conditions, then it is valid
    return res.status(200).json({ success: "Card is valid." });
  }
}
module.exports = new FormController();
