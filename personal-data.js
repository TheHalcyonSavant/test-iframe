window.onload = function(e) {
  $('#alertAge').hide();
  $('#missedTermsConditionsApprove').hide();

  var navEntries = window.performance.getEntriesByType('navigation');
  if (navEntries[0].type == 'back_forward') {
    $('#alertCustomerAlreadyExists').hide();
  }
}

// Rebuild page every single time it is accessed.
// This is done so alertAge does not show on start
// when user clicks the back button from Schritt2
window.onbeforeunload = function() {
}

$(document).ready(
    function() {
      // TRIDENT/ for IE 11 version
      // MSIE for IE below 11 version
      var browserIsIE = navigator.userAgent.toUpperCase().indexOf("TRIDENT/") != -1 || navigator.userAgent.toUpperCase().indexOf("MSIE") != -1;

      setTimeout(function() {
        loadInputsFromStorage();
        console.log('after loadInputsFromStorage');
      }, 500)

      function loadInputsFromStorage() {

        $('#salutation').val(localStorage.getItem('selectSalutationKey'));
        document.getElementById('input_firstName').value = localStorage.getItem('inputFirstNameKey');
        document.getElementById('input_lastName').value = localStorage.getItem('inputLastNameKey');

        // if address fields are not filled by server session,
        // then fill the fields using local storage on page load after 500 millisecs.
        // If fields are filled with information from UniServ (/v1/check-address), then
        // fields will not be overwritten with data from local storage on page load after 500
        // millisecs.
        if ($('#input_streetName').val().length === 0) {
          document.getElementById('input_streetName').value = localStorage.getItem('inputStreetNameKey');
        }

        if ($('#input_houseNumber').val().length === 0) {
          document.getElementById('input_houseNumber').value = localStorage.getItem('inputHouseNumberKey');
        }

        if ($('#input_additionalAddress').val().length === 0) {
          document.getElementById('input_additionalAddress').value = localStorage.getItem('inputAdditionalAddressKey');
        }

        if ($('#input_additionalAddress').val().length !== 0 && browserIsIE) {
          $('#spanAdditionalAddress').remove();
        }

        if ($('#input_zipCode').val().toString().length === 0) {
          document.getElementById('input_zipCode').value = localStorage.getItem('inputZipCodeKey');
        }

        if ($('#input_location').val().length === 0) {
          document.getElementById('input_location').value = localStorage.getItem('inputLocationKey');
        }

        document.getElementById('input_dayOfBirth').value = localStorage.getItem('inputDayOfBirthKey');
        document.getElementById('input_monthOfBirth').value = localStorage.getItem('inputMonthOfBirthKey');
        document.getElementById('input_yearOfBirth').value = localStorage.getItem('inputYearOfBirthKey');

        document.getElementById('input_telephoneNumber').value = localStorage.getItem('inputTelephoneNumberKey');
        document.getElementById('input_mobileNumber').value = localStorage.getItem('inputMobileNumberKey');
        document.getElementById('input_email').value = localStorage.getItem('inputEmailKey');

        if (localStorage.getItem('radioSingleKey') == 'true') {
          document.getElementById('radioSingle').checked = true;
        } else if (localStorage.getItem('radioMarriedKey') == 'true') {
          document.getElementById('radioMarried').checked = true;
        } else if (localStorage.getItem('radioNotSpecifiedKey') == 'true') {
          document.getElementById('radioNotSpecified').checked = true;
        }

        if (localStorage.getItem('radioEmployeeKey') == 'true') {
          document.getElementById('radioEmployee').checked = true;
        } else if (localStorage.getItem('radioSelfEmployedKey') == 'true') {
          document.getElementById('radioSelfEmployed').checked = true;
        } else if (localStorage.getItem('radioHomeMakerKey') == 'true') {
          document.getElementById('radioHomeMaker').checked = true;
        } else if (localStorage.getItem('radioPensionerKey') == 'true') {
          document.getElementById('radioPensioner').checked = true;
        } else if (localStorage.getItem('radioStudentKey') == 'true') {
          document.getElementById('radioStudent').checked = true;
        } else if (localStorage.getItem('radioPupilKey') == 'true') {
          document.getElementById('radioPupil').checked = true;
        } else if (localStorage.getItem('radioCivilServantKey') == 'true') {
          document.getElementById('radioCivilServant').checked = true;
        } else if (localStorage.getItem('radioNoDetailsKey') == 'true') {
          document.getElementById('radioNoDetails').checked = true;
        }
      }

      function addClassValid($input) {
        $input.removeClass('invalid').addClass('valid');
        $input.next('div.alert').removeClass('error-message-show').addClass('error');
      }

      function addClassInvalid($input) {
        $input.removeClass('valid').addClass('invalid');
        // $input.next('div.alert').removeClass('error').addClass('error-message-show');
      }

      function calculateAge($dateOfBirth) {
        var today = new Date();
        var birthDate = new Date($dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        console.log('Age: ' + age);
        return age;
      }

      function scrollToErrorField() {
        var scrollSpeed = 500;
        var formData = $('#personalData').serializeArray();
        for ( var input in formData) {
          var element = $('#input_' + formData[input]['name']);
          var invalid = element.hasClass('invalid');
          if (invalid) {
            $('html, body').animate({
              scrollTop : $('#input_' + formData[input]['name']).offset().top - 130
            }, scrollSpeed);
            break;
          }
        }
      }

      function scrollToAlert($alertId) {
        var scrollSpeed = 500;
        $('html, body').animate({
          scrollTop : $('#' + $alertId).offset().top - 130
        }, scrollSpeed);
      }

      function removeAllWhiteSpaces(str) {
        return str.replace(/\s/g, '');
      }

      var houseNumber;
      var buildingNumber;
      function splitHouseAndBuildingNumber(houseAndBuildingNumber) {
        houseNumber = houseAndBuildingNumber.replace(/[^\d].*/, '');
        buildingNumber = houseAndBuildingNumber.substring(houseNumber.length, houseAndBuildingNumber.length);
        buildingNumber = removeAllWhiteSpaces(buildingNumber);
      }

      // In case user refreshes or is redirected to this page with all intact inputs
      // and submit button is clicked, then on('input', function()..) should be triggered
      // so valid/invalid classes are added to input before submission
      function triggerInputs() {
        $('#input_firstName').trigger('input');
        $('#input_lastName').trigger('input');

        $('#input_streetName').trigger('input');
        $('#input_houseNumber').trigger('input');
        $('#input_zipCode').trigger('input');
        $('#input_location').trigger('input');

        $('#input_dayOfBirth').trigger('input');
        $('#input_monthOfBirth').trigger('input');
        $('#input_yearOfBirth').trigger('input');

        $('#input_telephoneNumber').trigger('input');
        $('#input_mobileNumber').trigger('input');
        $('#input_email').trigger('input');

        localStorage.setItem('selectSalutationKey', $('#salutation').val());

        localStorage.setItem('inputFirstNameKey', document.getElementById('input_firstName').value);
        localStorage.setItem('inputLastNameKey', document.getElementById('input_lastName').value);

        localStorage.setItem('inputStreetNameKey', document.getElementById('input_streetName').value);
        localStorage.setItem('inputHouseNumberKey', document.getElementById('input_houseNumber').value);
        localStorage.setItem('inputAdditionalAddressKey', document.getElementById('input_additionalAddress').value);
        localStorage.setItem('inputZipCodeKey', document.getElementById('input_zipCode').value);
        localStorage.setItem('inputLocationKey', document.getElementById('input_location').value);

        localStorage.setItem('inputDayOfBirthKey', document.getElementById('input_dayOfBirth').value);
        localStorage.setItem('inputMonthOfBirthKey', document.getElementById('input_monthOfBirth').value);
        localStorage.setItem('inputYearOfBirthKey', document.getElementById('input_yearOfBirth').value);

        localStorage.setItem('inputTelephoneNumberKey', document.getElementById('input_telephoneNumber').value);
        localStorage.setItem('inputMobileNumberKey', document.getElementById('input_mobileNumber').value);
        localStorage.setItem('inputEmailKey', document.getElementById('input_email').value);

        localStorage.setItem('radioSingleKey', document.getElementById('radioSingle').checked);
        localStorage.setItem('radioMarriedKey', document.getElementById('radioMarried').checked);
        localStorage.setItem('radioNotSpecifiedKey', document.getElementById('radioNotSpecified').checked);

        localStorage.setItem('radioEmployeeKey', document.getElementById('radioEmployee').checked);
        localStorage.setItem('radioCivilServantKey', document.getElementById('radioCivilServant').checked);
        localStorage.setItem('radioSelfEmployedKey', document.getElementById('radioSelfEmployed').checked);
        localStorage.setItem('radioHomeMakerKey', document.getElementById('radioHomeMaker').checked);
        localStorage.setItem('radioPensionerKey', document.getElementById('radioPensioner').checked);
        localStorage.setItem('radioPupilKey', document.getElementById('radioPupil').checked);
        localStorage.setItem('radioStudentKey', document.getElementById('radioStudent').checked);
        localStorage.setItem('radioNoDetailsKey', document.getElementById('radioNoDetails').checked);

      }

      $('#clearStorageTest').click(function() {
        console.log('cleared');
        localStorage.clear();
      })

      $('select').on('change', function() {
        if ($(this).val() == '') {
          $('div.select-wrap').removeClass('valid').addClass('invalid');
          // $('div.select').removeClass('error').addClass('error-message-show');
        } else {
          $('div.select-wrap').removeClass('invalid').addClass('valid');
          $('div.select').removeClass('error-message-show').addClass('error');
        }
      })

      $('#input_firstName').on('input', function() {
        var input = $(this);
        var firstName = input.val().trim();
        var re = /^[a-zA-Z\. Ã„Ã–ÃœÃ¤Ã¶Ã¼ÃŸ&Ã©Ã‰Ã¨ÃˆÃ¡ÃÃ Ã€ÃºÃšÃ¹Ã™Ã‚Ã¢ÃƒÃ£Ã…Ã¥Ã‹Ã«ÃŠÃªÃÃ¯ÃÃ­ÃŒÃ¬ÃŽÃ®Ã›Ã»Ã“Ã³Ã’Ã²Ã”Ã´Ã•ÃµÃ‡Ã§Ã†Ã¦Å’Å“Ã‘Ã±'\-\+]*$/;
        var isAlphabetic = re.test(firstName);
        if (isAlphabetic && firstName.length > 2) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_lastName').on('input', function() {
        var input = $(this);
        var lastName = input.val().trim();
        var re = /^[a-zA-Z\. Ã„Ã–ÃœÃ¤Ã¶Ã¼ÃŸ&Ã©Ã‰Ã¨ÃˆÃ¡ÃÃ Ã€ÃºÃšÃ¹Ã™Ã‚Ã¢ÃƒÃ£Ã…Ã¥Ã‹Ã«ÃŠÃªÃÃ¯ÃÃ­ÃŒÃ¬ÃŽÃ®Ã›Ã»Ã“Ã³Ã’Ã²Ã”Ã´Ã•ÃµÃ‡Ã§Ã†Ã¦Å’Å“Ã‘Ã±'\-\+]*$/;
        var isAlphabetic = re.test(lastName);
        if (isAlphabetic && lastName.length > 2) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_streetName').on('input', function() {
        var input = $(this);
        var streetName = input.val().trim();
        var re = /^[0-9a-zA-Z\. Ã„Ã–ÃœÃ¤Ã¶Ã¼ÃŸ&Ã©Ã‰Ã¨ÃˆÃ¡ÃÃ Ã€ÃºÃšÃ¹Ã™Ã‚Ã¢ÃƒÃ£Ã…Ã¥Ã‹Ã«ÃŠÃªÃÃ¯ÃÃ­ÃŒÃ¬ÃŽÃ®Ã›Ã»Ã“Ã³Ã’Ã²Ã”Ã´Ã•ÃµÃ‡Ã§Ã†Ã¦Å’Å“Ã‘Ã±'\-\+]*$/;
        var isAlphabetic = re.test(streetName);
        if (isAlphabetic && streetName.length > 2) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_additionalAddress').on('input', function() {
        if (browserIsIE) {
          $('#spanAdditionalAddress').remove();
        }
      })

      $('#input_houseNumber').on('input', function() {
        var input = $(this);
        var houseAndBuildingNumber = input.val().trim();
        var re = /^([0-9]+)([0-9A-za-z-+\/,.\s]+)?$/
        var hasCorrectOrder = re.test(houseAndBuildingNumber);
        splitHouseAndBuildingNumber(houseAndBuildingNumber);
        if (hasCorrectOrder && houseNumber.length <= 4 && buildingNumber.length <= 4) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_zipCode').on('input', function() {
        var input = $(this);
        var zipCode = input.val();
        var re = /^[a-zA-ZÃ„Ã–ÃœÃ¤Ã¶Ã¼ 0-9-]*$/;
        var isNumeric = re.test(zipCode);
        if (isNumeric) {
          addClassValid(input);
        } else {
          console.log('isWord or length is not 10');
          addClassInvalid(input);
        }
      })

      $('#input_location').on('input', function() {
        var input = $(this);
        var location = input.val().trim();
        var re = /^[0-9a-zA-Z\. Ã„Ã–ÃœÃ¤Ã¶Ã¼ÃŸ&Ã©Ã‰Ã¨ÃˆÃ¡ÃÃ Ã€ÃºÃšÃ¹Ã™Ã‚Ã¢ÃƒÃ£Ã…Ã¥Ã‹Ã«ÃŠÃªÃÃ¯ÃÃ­ÃŒÃ¬ÃŽÃ®Ã›Ã»Ã“Ã³Ã’Ã²Ã”Ã´Ã•ÃµÃ‡Ã§Ã†Ã¦Å’Å“Ã‘Ã±'\-\+]*$/;
        var isAlphabetic = re.test(location);
        if (location != '' && location.length > 2 && isAlphabetic) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_dayOfBirth').on('input', function() {
        var input = $(this);
        var dayOfBirth = input.val().trim();
        var re = /^[0-9]+$/;
        var isNumeric = re.test(dayOfBirth);
        if (isNumeric) {
          if (dayOfBirth > 31 || dayOfBirth == 0) {
            addClassInvalid(input);
          } else {
            addClassValid(input);
          }
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_monthOfBirth').on('input', function() {
        var input = $(this);
        var monthOfBirth = input.val().trim();
        var re = /^[0-9]+$/;
        var isNumeric = re.test(monthOfBirth);
        if (isNumeric) {
          if (monthOfBirth > 12 || monthOfBirth == 0) {
            addClassInvalid(input);
          } else {
            addClassValid(input);
          }
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_yearOfBirth').on('input', function() {
        var input = $(this);
        var yearOfBirth = input.val();
        var re = /^[0-9]+$/;
        var isNumeric = re.test(yearOfBirth);
        if (isNumeric) {
          if (yearOfBirth < 1900 || yearOfBirth > new Date().getFullYear()) {
            addClassInvalid(input);
          } else {
            addClassValid(input);
          }
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_email').on('input', function() {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&\-â€™*+\/=?^_`{|}~-Ã¤Ã¶Ã¼Ã„Ã–Ãœ]+@(([a-zA-Z0-9-Ã¤Ã¶Ã¼Ã„Ã–Ãœ]{1,}\.)+)([a-zA-Z0-9-Ã¤Ã¶Ã¼Ã„Ã–Ãœ]{2,63})$/;
        var emailInput = input.val();
        var email = re.test(emailInput.trim());
        if (email) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_telephoneNumber').on('input', function() {
        var input = $(this);
        var telephoneNumber = input.val().trim();
        var re = /^[0-9-+()_.,\/\s]+$/;
        var isNumeric = re.test(telephoneNumber);
        if (isNumeric) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      $('#input_mobileNumber').on('input', function() {
        var input = $(this);
        var mobileNumber = input.val().trim();
        var re = /^[0-9-+()_.,\/\s]+$/;
        var isNumeric = re.test(mobileNumber);
        if (isNumeric) {
          addClassValid(input);
        } else {
          addClassInvalid(input);
        }
      })

      // In case user clicks on submit without selecting a button,
      // all radio button borders related to familystatus
      // are then highlighted red. If user then after selects any radio button,
      // the highlighting disappears.
      $('input[name="familyStatus"]').on('input', function() {
        if ($('input[name="familyStatus"]:checked').length === 0) {
          $('input[name="familyStatus"]').removeClass('valid-radio').addClass('invalid-radio');
        } else {
          $('input[name="familyStatus"]').removeClass('invalid-radio').addClass('valid-radio');
        }
      })

      // In case user clicks on submit without selecting a button,
      // all radio button borders related to professionStatus
      // are then highlighted red. If user then after selects any radio button,
      // the highlighting disappears.
      $('input[name="professionStatus"]').on('input', function() {
        if ($('input[name="professionStatus"]:checked').length === 0) {
          $('input[name="professionStatus"]').removeClass('valid-radio').addClass('invalid-radio');
        } else {
          $('input[name="professionStatus"]').removeClass('invalid-radio').addClass('valid-radio');
        }
      })

      // In case user clicks on submit without selecting the checkbox,
      // then the checkbox border is highlighted red.
      // If user then after selects the checkbox,
      // the highlighting disappears.
      $('input[name="termsAndConditions"]').on('input', function() {
        if ($('input[name="termsAndConditions"]:checked').length === 0) {
          $('input[name="termsAndConditions"]').removeClass('valid-radio').addClass('invalid-radio');
        } else {
          $('input[name="termsAndConditions"]').removeClass('invalid-radio').addClass('valid-radio');
        }
      })

      $(document).on("tap click", 'label a', function(event, data) {
        event.stopPropagation();
        event.preventDefault();
        window.open($(this).attr('href'), $(this).attr('target'));
        return false;
      });

      // After Form Submitted Validation
      $('#personalDataSubmit input').click(
          function(event) {
            triggerInputs();

            var formData = $('#personalData').find('input').serializeArray();
            console.log($('#personalData').serializeArray());
            var errorFree = true;

            for ( var input in formData) {
              // exclude non-required field -> additionalAddress and radio buttons ->
              // familyStatus
              // and
              // professionStatus from addClass
              if (formData[input]['name'] != 'familyStatus' && formData[input]['name'] != 'professionStatus'
                  && formData[input]['name'] != 'additionalAddress' && formData[input]['name'] != 'termsAndConditions') {
                console.log(formData[input]['name']);
                var element = $('#input_' + formData[input]['name']);
                var valid = element.hasClass('valid');
                console.log('isValid: ', valid);

                if (!valid) {
                  element.removeClass('valid').addClass('invalid');
                  element.next('div.alert').removeClass('error').addClass('error-message-show');
                  errorFree = false;
                } else {
                  element.removeClass('invalid').addClass('valid');
                  element.next('div.alert').removeClass('error-message-show').addClass('error');
                }
              }
            }

            if ($('#salutation').val() == '') {
              $('div.select-wrap').removeClass('valid').addClass('invalid');
              $('div.select').removeClass('error').addClass('error-message-show');
            } else {
              $('div.select-wrap').removeClass('invalid').addClass('valid');
              $('div.select').removeClass('error-message-show').addClass('error');
            }

            var dateOfBirth;
            if (browserIsIE) {
              var dayOfBirth = $('#input_dayOfBirth').val().length === 1 ? '0' + $('#input_dayOfBirth').val() : $('#input_dayOfBirth').val();
              var monthOfBirth = $('#input_monthOfBirth').val().length === 1 ? '0' + $('#input_monthOfBirth').val() : $('#input_monthOfBirth').val();
              dateOfBirth = $('#input_yearOfBirth').val() + '-' + monthOfBirth + '-' + dayOfBirth;
            } else {
              dateOfBirth = $('#input_yearOfBirth').val() + '-' + $('#input_monthOfBirth').val() + '-' + $('#input_dayOfBirth').val();
            }
            if (calculateAge(dateOfBirth) >= 18) {
              $('#alertAge').hide();
            } else {
              errorFree = false;
              $('#alertAge').show();
              scrollToAlert("alertAge");
            }

            if ($('input[name="familyStatus"]:checked').length === 0) {
              $('input[name="familyStatus"]').removeClass('valid-radio').addClass('invalid-radio');
              errorFree = false;
            } else {
              $('input[name="familyStatus"]').removeClass('invalid-radio').addClass('valid-radio');
            }

            if ($('input[name="professionStatus"]:checked').length === 0) {
              $('input[name="professionStatus"]').removeClass('valid-radio').addClass('invalid-radio');
              errorFree = false;
            } else {
              $('input[name="professionStatus"]').removeClass('invalid-radio').addClass('valid-radio');
            }

            if ($('input[name="termsAndConditions"]:checked').length === 0) {
              $('input[name="termsAndConditions"]').removeClass('valid-radio').addClass('invalid-radio');
              errorFree = false;
              $('#missedTermsConditionsApprove').show();
            } else {
              $('input[name="termsAndConditions"]').removeClass('invalid-radio').addClass('valid-radio');
              $('#missedTermsConditionsApprove').hide();
            }

            // This is done so only one alert is shown at a time
            if (($('#alertCustomerAlreadyExists').is(':visible') && $('#alertAge').is(':visible'))
                || ($('#alertEmailAlreadyInUse').is(':visible') && $('#alertAge').is(':visible')) || ($('#alertInvalidAddress').is(':visible'))) {
              $('#alertCustomerAlreadyExists').hide();
              $('#alertEmailAlreadyInUse').hide();
            }

            if (!errorFree) {
              scrollToErrorField();
              console.log('Errors: Form will not be submitted');
              event.preventDefault();
            } else {
              $('#alertCustomerAlreadyExists').hide();
              $('#alertEmailAlreadyInUse').hide();
              $('#alertAge').hide();
              $('#alertInvalidAddress').hide();
              console.log('No errors: Form will be submitted');
            }
          });
      console.log('before postMessage', window.parent.postMessage);
      window.parent.postMessage({ source: 'ims-loyalty', width: window.innerWidth, height: window.innerHeight }, '*');
    })
console.log('end personal-data');
