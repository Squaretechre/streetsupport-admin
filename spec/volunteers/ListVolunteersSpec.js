/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('List Volunteers', function () {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(function () {
    var getVolunteersPromise = function () {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': volunteerData()
          })
        }
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .withArgs(endpoints.volunteers, headers)
      .returns(getVolunteersPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading', function () {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get volunteers from api', function () {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set volunteers', function () {
    expect(model.volunteers().length).toEqual(3)
  })

  it('should order by creationDate', function () {
    expect(model.volunteers()[0].id).toEqual('56f2867701ad122cd0eb5b2f')
    expect(model.volunteers()[1].id).toEqual('570542130a4f951fb8abe4b9')
    expect(model.volunteers()[2].id).toEqual('571dd1fcd021fb2890259127')
  })

  it('should set url to contact volunteer', function () {
    expect(model.volunteers()[1].contactUrl).toEqual(adminUrls.contactVolunteer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should format creationDate', function () {
    expect(model.volunteers()[1].creationDate).toEqual('06/04/16')
  })

  it('should show user then that is loaded', function () {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

var volunteerData = function () {
  return [{
    'id': '56f2867701ad122cd0eb5b2f',
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '07944780742',
      'email': 'vince.lee@polyhatsoftware.co.uk',
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
      'description': 'the interwebz. beating people up, '
    },
    'availability': {
      'description': 'all day, everyday'
    },
    'resources': {
      'description': 'i have a big car'
    },
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': '571dd1fcd021fb2890259127',
    'person': {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'telephone': '',
      'email': 'vslee888+ncc@gmail.com',
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
      'description': 's'
    },
    'availability': {
      'description': 'a'
    },
    'resources': {
      'description': 'r'
    },
    'creationDate': '2016-04-25T08:14:52.7170000Z'
  }, {
    'id': '570542130a4f951fb8abe4b9',
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '',
      'email': 'vslee888+060416@gmail.com',
      'postcode': 'M1 2JB'
    },
    'skillsAndExperience': {
      'description': '&lt;script&gt;alert(&#39;xss!&#39;);&lt;/script&gt;'
    },
    'availability': {
      'description': '&quot;%3cscript%3ealert(document.cookie)%3c/script%3e'
    },
    'resources': {
      'description': '&lt;scr&lt;script&gt;ipt&gt;alert(document.cookie)&lt;/script&gt;'
    },
    'creationDate': '2016-04-06T17:06:27.1830000Z'
  }]
}
