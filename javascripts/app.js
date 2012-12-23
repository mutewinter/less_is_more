(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"app": function(exports, require, module) {
  
module.exports = Ember.Application.create({
  firstSlide: (function() {
    return this.get('slides.firstObject');
  }).property('slides.@each'),
  nextSlide: (function() {
    var slideIndex, slides;
    slides = this.get('slides');
    slideIndex = slides.indexOf(this.get('currentSlide'));
    return slides.objectAt(slideIndex + 1);
  }).property('currentSlide'),
  previousSlide: (function() {
    var slideIndex, slides;
    slides = this.get('slides');
    slideIndex = slides.indexOf(this.get('currentSlide'));
    return slides.objectAt(slideIndex - 1);
  }).property('currentSlide'),
  currentSlidePosition: (function() {
    var currentSlide, slidePosition;
    currentSlide = this.get('currentSlide');
    if (!currentSlide) {
      return;
    }
    return slidePosition = this.get('slides').indexOf(currentSlide) + 1;
  }).property('currentSlide'),
  config: Ember.Object.create({
    safeMode: true,
    showNotes: true
  })
});

}});
window.moduleNames.push("app");

window.require.define({"controllers/application": function(exports, require, module) {
  
App.ApplicationController = Ember.Controller.extend();

}});
window.moduleNames.push("controllers/application");

window.require.define({"controllers/slide": function(exports, require, module) {
  
App.SlideController = Ember.Controller.extend();

}});
window.moduleNames.push("controllers/slide");

window.require.define({"controllers/slide_container": function(exports, require, module) {
  
App.SlideContainerController = Ember.Controller.extend();

}});
window.moduleNames.push("controllers/slide_container");

window.require.define({"controllers/slides": function(exports, require, module) {
  
App.SlidesController = Ember.ArrayController.extend();

}});
window.moduleNames.push("controllers/slides");

window.require.define({"data/slides": function(exports, require, module) {
  
App.Slide.reopenClass({
  slideOrder: [
    {
      templateName: 'what_is_coffeescript',
      title: 'What is CoffeeScript?'
    }, {
      templateName: 'by_the_numbers',
      title: 'By the Numbers'
    }, {
      templateName: 'follow_along',
      title: 'Follow Along'
    }, {
      templateName: 'code_samples',
      title: 'Code Samples'
    }, {
      templateName: 'annoyance_is_optional',
      title: 'Annoyance is Optional'
    }, {
      templateName: 'english_operators',
      title: 'English Operators'
    }, {
      templateName: 'string_enhancements',
      title: 'String Enhancements'
    }, {
      templateName: 'simple_object_literals',
      title: 'Simple Object Literals'
    }, {
      templateName: 'functions',
      title: 'Functions'
    }, {
      templateName: 'implicit_return',
      title: 'Implicit Return'
    }, {
      templateName: 'ranges',
      title: 'Ranges'
    }, {
      templateName: 'suffix_conditionals',
      title: 'Suffix Conditionals'
    }, {
      templateName: 'loops',
      title: 'Loops'
    }, {
      templateName: 'bound_functions',
      title: 'Bound Functions'
    }, {
      templateName: 'switch_statement',
      title: 'Switch Statement'
    }, {
      templateName: 'existential_operator',
      title: 'Existential Operator'
    }, {
      templateName: 'variable_scoping',
      title: 'Variable Scoping'
    }, {
      templateName: 'ternary_operator',
      title: 'Ternary Operator'
    }, {
      templateName: 'do_keyword',
      title: 'Do Keyword'
    }, {
      templateName: 'class_syntax',
      title: 'Class Syntax'
    }, {
      templateName: 'destructured_assignment',
      title: 'Destructured Assignment'
    }, {
      templateName: 'and_finally',
      title: 'And Finally'
    }
  ]
});

}});
window.moduleNames.push("data/slides");

window.require.define({"helpers/code": function(exports, require, module) {
  
Handlebars.registerHelper('code', function(options) {
  return Ember.Handlebars.helpers.view.call(this, 'App.CodeAndExampleView', options);
});

}});
window.moduleNames.push("helpers/code");

window.require.define({"initialize": function(exports, require, module) {
  var folderOrder;

window.App = require('app');

require('router');

folderOrder = 'models data helpers templates controllers views'.w();

folderOrder.forEach(function(folder) {
  return window.moduleNames.filter(function(moduleName) {
    return new RegExp("^" + folder).test(moduleName);
  }).forEach(function(matchingModule) {
    return require(matchingModule);
  });
});

App.set('slides', App.Slide.slideOrder.map(function(slideObject) {
  return App.Slide.create(slideObject);
}));

App.initialize();

}});
window.moduleNames.push("initialize");

window.require.define({"models/slide": function(exports, require, module) {
  
App.Slide = Ember.Object.extend({
  slug: (function() {
    return this.get('templateName').dasherize();
  }).property('templateName'),
  templatePath: (function() {
    if (this.get('templateName')) {
      return "templates/slides/" + (this.get('templateName'));
    }
  }).property('templateName'),
  isLastShownSlide: (function() {
    return this === App.get('lastShownSlide');
  }).property('App.lastShownSlide'),
  slideNumber: (function() {
    return App.get('slides').indexOf(this) + 1;
  }).property()
});

}});
window.moduleNames.push("models/slide");

window.require.define({"router": function(exports, require, module) {
  
App.Router = Ember.Router.extend({
  enableLogging: false,
  goToSlide: Ember.Route.transitionTo('slides.show'),
  goHome: Ember.Route.transitionTo('index'),
  root: Ember.Route.extend({
    loading: Ember.State.extend(),
    index: Ember.Route.extend({
      route: '/',
      redirectsTo: 'slides.index'
    }),
    slides: Ember.Route.extend({
      route: '/slides',
      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          var controller;
          controller = router.get('applicationController');
          return controller.connectOutlet('slides', App.get('slides'));
        }
      }),
      show: Ember.Route.extend({
        route: '/:slug',
        serialize: function(router, slide) {
          if (slide) {
            return {
              slug: slide.get('slug')
            };
          } else {
            router.transitionTo('slides.index');
            return {
              slug: ''
            };
          }
        },
        deserialize: function(router, params) {
          return App.get('slides').findProperty('slug', params.slug);
        },
        exit: function(router) {
          router.get('applicationView').resetClasses();
          App.set('lastShownSlide', App.get('currentSlide'));
          return App.set('currentSlide', null);
        },
        connectOutlets: function(router, slide) {
          var controller;
          controller = router.get('applicationController');
          App.set('currentSlide', slide);
          return controller.connectOutlet('slideContainer', slide);
        }
      })
    })
  })
});

}});
window.moduleNames.push("router");

window.require.define({"templates/application": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n          ");
  stack1 = depth0;
  stack2 = "App.currentSlidePosition";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " / ");
  stack1 = depth0;
  stack2 = "App.slides.length";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n        ");
  return buffer;}

function program3(depth0,data) {
  
  
  data.buffer.push("\n          &nbsp;\n        ");}

  data.buffer.push("<div class=\"container\">\n  ");
  stack1 = depth0;
  stack2 = "outlet";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n  <footer class=\"app-footer\">\n    <ul>\n      <li>\n        <label>\n          ");
  stack1 = depth0;
  stack2 = "Ember.Checkbox";
  stack3 = {};
  stack4 = "App.config.showNotes";
  stack3['checkedBinding'] = stack4;
  stack4 = helpers.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n          Show Notes\n        </label>\n      </li>\n      <li>\n        Created by <a href=\"http://twitter.com/mutewinter\">Jeremy Mack</a>\n      </li>\n      <li>\n        ");
  stack1 = depth0;
  stack2 = "App.currentSlide";
  stack3 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </li>\n    </ul>\n  </footer>\n</div>\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/application");

window.require.define({"templates/code_toolbar": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n    ");
  stack1 = depth0;
  stack2 = "view.errorMessage";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n  ");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n    ");
  stack1 = depth0;
  stack2 = "view.message";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n  ");
  return buffer;}

function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n    <a ");
  stack1 = depth0;
  stack2 = "resetCode";
  stack3 = {};
  stack4 = "view";
  stack3['target'] = stack4;
  stack4 = helpers.action;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " href=\"#\">\n      Reset Sample\n    </a>\n  ");
  return buffer;}

  data.buffer.push("<div ");
  stack1 = {};
  stack2 = ":messages view.hasError:error";
  stack1['class'] = stack2;
  stack2 = helpers.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  stack1 = stack2.call(depth0, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n  ");
  stack1 = depth0;
  stack2 = "view.hasError";
  stack3 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n<div class=\"buttons\">\n  ");
  stack1 = depth0;
  stack2 = "view.canResetCode";
  stack3 = helpers['if'];
  tmp1 = self.program(5, program5, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n&nbsp;\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/code_toolbar");

window.require.define({"templates/examples/log": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression;


  data.buffer.push("<header>\n  <h4>Log Messages</h4>\n</header>\n<pre class=\"log-area\">\n");
  stack1 = depth0;
  stack2 = "view.logMessagesText";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n</pre>\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/examples/log");

window.require.define({"templates/fake_code": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var foundHelper, self=this;


  data.buffer.push("Code Sample\n");
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/fake_code");

window.require.define({"templates/slide": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1>");
  stack1 = depth0;
  stack2 = "content.title";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "</h1>\n");
  stack1 = depth0;
  stack2 = "App.SlideContentView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = helpers.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slide");

window.require.define({"templates/slide_container": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, stack5, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4, stack5, stack6;
  data.buffer.push("\n    <a ");
  stack1 = depth0;
  stack2 = "App.previousSlide";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = {};
  stack6 = true;
  stack5['href'] = stack6;
  stack6 = helpers.action;
  tmp1 = {};
  tmp1.hash = stack5;
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack6.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n      &lt; ");
  stack1 = depth0;
  stack2 = "App.previousSlide.title";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n    </a>\n    ");
  return buffer;}

function program3(depth0,data) {
  
  
  data.buffer.push("\n      &nbsp;\n    ");}

function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4, stack5, stack6;
  data.buffer.push("\n    <a ");
  stack1 = depth0;
  stack2 = "App.nextSlide";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = {};
  stack6 = true;
  stack5['href'] = stack6;
  stack6 = helpers.action;
  tmp1 = {};
  tmp1.hash = stack5;
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack6.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n      ");
  stack1 = depth0;
  stack2 = "App.nextSlide.title";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " &gt;\n    </a>\n    ");
  return buffer;}

function program7(depth0,data) {
  
  
  data.buffer.push("\n      &nbsp;\n    ");}

  data.buffer.push("<ul class=\"slide-controls\">\n  <li ");
  stack1 = depth0;
  stack2 = "App.previousSlide";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = helpers.action;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack5.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n    ");
  stack1 = depth0;
  stack2 = "App.previousSlide";
  stack3 = helpers['if'];
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(3, program3, data);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </li>\n  <li ");
  stack1 = depth0;
  stack2 = "goHome";
  stack3 = helpers.action;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " class=\"slide-controls-home\">\n    <a ");
  stack1 = depth0;
  stack2 = "goHome";
  stack3 = {};
  stack4 = true;
  stack3['href'] = stack4;
  stack4 = helpers.action;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " >Home</a>\n  </li>\n  <li ");
  stack1 = depth0;
  stack2 = "App.nextSlide";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = helpers.action;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack5.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n    ");
  stack1 = depth0;
  stack2 = "App.nextSlide";
  stack3 = helpers['if'];
  tmp1 = self.program(5, program5, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.program(7, program7, data);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </li>\n</ul>\n<div class=\"slide-background\">\n  <div class=\"slide-container\">\n    ");
  stack1 = depth0;
  stack2 = "App.SlideView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = helpers.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n  </div>\n</div>\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slide_container");

window.require.define({"templates/slides": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, stack5, stack6, foundHelper, tmp1, self=this, escapeExpression=this.escapeExpression, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4, stack5, stack6, stack7;
  data.buffer.push("\n  ");
  stack1 = depth0;
  stack2 = "content";
  stack3 = depth0;
  stack4 = "as";
  stack5 = depth0;
  stack6 = "view.content";
  stack7 = helpers['with'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack5);
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack7.call(depth0, stack6, stack4, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4, stack5;
  data.buffer.push("\n    <div ");
  stack1 = depth0;
  stack2 = "content";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = helpers.action;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack5.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n      ");
  stack1 = {};
  stack2 = ":slide-container :preview content.isLastShownSlide:flash";
  stack1['class'] = stack2;
  stack2 = helpers.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  stack1 = stack2.call(depth0, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">\n      ");
  stack1 = depth0;
  stack2 = "App.SlideView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = true;
  stack3['preview'] = stack4;
  stack4 = helpers.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack4.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n    </div>\n    <span class=\"slide-number\">\n      ");
  stack1 = depth0;
  stack2 = "content.slideNumber";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + " / ");
  stack1 = depth0;
  stack2 = "App.slides.length";
  stack3 = helpers._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + "\n    </span>\n  ");
  return buffer;}

  data.buffer.push("<div class=\"banner\">\n  <h1>Less is More with CoffeeScript</h1>\n  <div class=\"subtitle\">\n    Less code means less debugging, testing, and maintainence. CoffeeScript's\n    terse syntax allows for maximum productivity whilst encouraging good\n    JavaScript coding practices.\n  </div>\n</div>\n<div class=\"instructions\">\n  <a ");
  stack1 = depth0;
  stack2 = "App.firstSlide";
  stack3 = depth0;
  stack4 = "goToSlide";
  stack5 = {};
  stack6 = true;
  stack5['href'] = stack6;
  stack6 = helpers.action;
  tmp1 = {};
  tmp1.hash = stack5;
  tmp1.contexts = [];
  tmp1.contexts.push(stack3);
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  stack1 = stack6.call(depth0, stack4, stack2, tmp1);
  data.buffer.push(escapeExpression(stack1) + ">Start Here</a> or Click a Slide Below\n</div>\n");
  stack1 = {};
  stack2 = "slide-list";
  stack1['class'] = stack2;
  stack2 = "content";
  stack1['contentBinding'] = stack2;
  stack2 = "ul";
  stack1['tagName'] = stack2;
  stack2 = "li";
  stack1['itemTagName'] = stack2;
  foundHelper = helpers.collection;
  stack2 = foundHelper || depth0.collection;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides");

window.require.define({"templates/slides/and_finally": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var foundHelper, self=this;


  data.buffer.push("<h2 class=\"text-center\">\n  Go look at the <a href=\"http://github.com/mutewinter/less_is_more\">code on\n    GitHub</a> for this presentation.\n</h2>\n<h2>\n  Special thanks to:\n</h2>\n<ul>\n  <li><a href=\"http://en.wikipedia.org/wiki/Jeremy_Ashkenas\">Jeremy Ashkenas\n    </a> for making CoffeeScript</li>\n  <li><a href=\"http://codemirror.net/\">CodeMirror</a> for making the code editing\n    and possible\n  </li>\n  <li>The <a href=\"http://emberjs.com/\">Ember.js</a> team for making building\n    this presentation effortless\n  </li>\n</ul>\n<h2>\n  You might also like <a href=\"http://mutewinter.github.com/why_ember\">Why\n    Ember?</a>, a presentation I made about Ember.js</a>\n</h2>\n");
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/and_finally");

window.require.define({"templates/slides/annoyance_is_optional": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var foundHelper, self=this;


  data.buffer.push("<ul>\n  <li>Most JavaScript symbols are optional or obsolete</li>\n  <li>Semicolons are automatic</li>\n  <li>Commas in lists are optional</li>\n  <li>Parenthesis are optional for method calls with arguments</li>\n  <li>Curly braces are optional for objects and functions</li>\n</ul>\n");
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/annoyance_is_optional");

window.require.define({"templates/slides/bound_functions": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n$('.slide h1').off('click')\n\nclass ClickMaster5000\n  message: 'You clicked the crap out of that title.'\n\n  constructor: ->\n    $('.slide h1').on 'click', (e) ->\n      unless @message\n        log 'Change that click handler to a fat arrow =>'\n      $(e.target).text(@message)\n\nnew ClickMaster5000\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  No more that, _this, self.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/bound_functions");

window.require.define({"templates/slides/by_the_numbers": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n  <p>\n    CoffeeScript is written in CoffeeScript dude. Like, woah.\n  </p>\n");}

  data.buffer.push("<ul>\n  <li>3,266 Lines of CoffeeScript</li>\n  <li>3,580 Lines of Tests</li>\n  <li>39 Code Samples on <a\n    href=\"http://coffeescript.org/\">CoffeeScript.org</a></li>\n  <li>Latest Version 1.4.0</li>\n  </li>\n</ul>\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/by_the_numbers");

window.require.define({"templates/slides/class_syntax": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\nclass Keyboard\n  audience: 'newbies'\n  goodFor: ->\n    switch @audience\n      when 'newbies' then 'Everyone'\n      when 'prosumers' then 'Professionals'\n      when 'robots' then 'Cyborgs'\n\nclass DasKeyboard extends Keyboard\n  audience: 'prosumers'\n\nclass KensisKeyboard extends Keyboard\n  audience: 'robots'\n\nclass TouchCover extends Keyboard\n  goodFor: -> 'Microsoft'\n\nlog new Keyboard().goodFor()\nlog new DasKeyboard().goodFor()\nlog new KensisKeyboard().goodFor()\nlog new TouchCover().goodFor()\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  You'll actually use them!\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/class_syntax");

window.require.define({"templates/slides/code_samples": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Change Slide Background Color to Canary Yellow'\n$('.slide-container').css('background-color': 'rgba(255,255, 51,0.2)')\n\n'Change Heading Color to Dark Yellow'\n$('.slide h1').css(color: '#666600')\n\n'Change Header Background and Border to Match'\n$('.slide h1').css\n    'background-color': 'rgba(226, 235, 16, 0.5)'\n    'border-color': '#666600'\n    'border-bottom-width': '5px'\n");}

function program3(depth0,data) {
  
  
  data.buffer.push("\n  <p>\n    If you don't mess with the code samples you defeat the purprose of this\n    presentation. It's okay, touch it. That's what she said.\n  </p>\n");}

  data.buffer.push("<ul>\n  <li>The code samples in this presentation are interactive</li>\n  <li>Comments are strings so they show in the JavaScript output as well.</li>\n  <li>Try editing the code below and see how it affects the page.</li>\n</ul>\n\n");
  stack1 = {};
  stack2 = false;
  stack1['hasExampleView'] = stack2;
  foundHelper = helpers.code;
  stack2 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/code_samples");

window.require.define({"templates/slides/destructured_assignment": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n[one, two] = [1, 2]\n\nlog one, two\n\n\"Don't try this at home.\"\n{nested: inside: really: far, wow} =\n  nested:\n    inside:\n      really:\n        far: 'Whew'\n      wow:\n        another: 'Whew'\n\nlog far\nlog wow\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  It's as nice trick.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/destructured_assignment");

window.require.define({"templates/slides/do_keyword": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Failing at closures'\nfunctions = for number in [1...4] \n  -> number\n\nlog f() for f in functions\n\n'Winning at closures'\nclosedFunctions = for number in [1...4] \n  do (number) -> \n    -> number\n\nlog f() for f in closedFunctions\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Closures are hard, make them easy.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/do_keyword");

window.require.define({"templates/slides/english_operators": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Comparisons'\nlog 'Yo Dawg' is 'Yo Dawg'\nlog 4 isnt 3\n\n'Multiple boolean representations'\nlog not no\nlog yes\n\n'Boolean statements'\nlog true and false\nlog true or false\n\n'Key existence'\nlog 'lolKey' of lolKey: 'yep'\n\n'Fixes your bugs'\nlog 0 == ''\n\n'Forced == for those who want bugs'\nlog `0 == ''`\n");}

function program3(depth0,data) {
  
  
  data.buffer.push("\n  Back ticks ` allow you to embed JavaScript. This technique is used above to\n  demonstrate the double equals comparison.\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  More readable and enforces good practices.\n</h2>\n\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/english_operators");

window.require.define({"templates/slides/existential_operator": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Traverse Deep Objects with Confidence'\nnested =\n  one:\n    two:\n      three:\n        four: 'Deep Down'\n\nlog nested.one.derp?.three.four # Look ma, no errors\n# Uncomment this for a specatular error\n# log `nested.one.derp.three.four`\n\n'Conditional Assignemnt'\nx = null\nx ?= 'I used to be null'\nlog x\nx ?= \"This doesn't apply to me\"\nlog x\n\n'Even with Functions'\ngetCarMake = (model) ->\n  switch model\n    when 'G35' then 'Infiniti'\n    when 'Accord' then 'Honda'\n    when '370z' then 'Nissan'\n\nlog getCarMake('Vespa')?.toUpperCase()\nlog getCarMake('Accord')?.toUpperCase()\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Multiple lines of logic in a single character.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/existential_operator");

window.require.define({"templates/slides/follow_along": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n  <p>\n    How meta. This only really applies when I'm presenting this presentation to\n    you in person. Otherwise you're already on this page. Reading this text.\n    In your web browser. Hello. You've got too many extensions. Look at all\n    those I mean, I'm not trying to judge, but wow. Do you really need a\n    dedicated button to share on Digg?\n  </p>\n");}

  data.buffer.push("<ul>\n  <li>I'm going too slow?</li>\n  <li>Didn't catch that?</li>\n  <li>Want to play with the code?</li>\n  <li>Open <a\n    href=\"http://mutewinter.github.com/less_is_more\">http://mutewinter.github.com/less_is_more</a>\n  and follow along</li>\n  <li><a href=\"http://git.io/qU-AXA\">http://git.io/qU-AXA</a> for short</li>\n</ul>\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/follow_along");

window.require.define({"templates/slides/functions": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Functions without arguments'\nourHero = -> 'Mr. Bond'\n\n'Function with arguments'\ngreet = (person) -> \"Hello #{person}\"\n\n'Single line functions'\nevilGreeting = (enemy) -> \"#{greet enemy}, time to die.\"\n\nlog evilGreeting ourHero()\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Write sentences instead of syntax.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/functions");

window.require.define({"templates/slides/implicit_return": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\nmovies = [\n  {title: 'Looper', year: 2012}\n  {title: 'Cloud Atlas', year: 2012}\n  {title: 'Skyfall', year: 2012}\n  {title: 'Lost in Translation', year: 2003}\n]\n\nlog _.chain(movies)\n  .filter((movie) -> movie.year is 2012)\n  .map((movie) -> \"#{movie.title} (#{movie.year})\")\n  .value()\n\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Terse syntax allows you to treat functions like blocks.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/implicit_return");

window.require.define({"templates/slides/loops": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Loop over arrays'\ngardenHoses = ['Shiny Green', 'Matte Black', 'Flakey Pink']\n\nfor hose in gardenHoses\n  log 'The Best' if hose is 'Shiny Green'\n\n'Loop over objects'\npcManufacturers = {\n  dell: 'Below Average'\n  hp: 'Below Average'\n  lenovo: 'Below Average'\n  alienWare: 'Below Average'\n}\n\nfor key, value of pcManufacturers\n  log \"#{key} is #{value}\"\n\n'Implicit return'\nx = for key, value of pcManufacturers\n  key\n\nlog \"#{x.join(', ')} make computers\"\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  No more counter-based loops.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/loops");

window.require.define({"templates/slides/ranges": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Just like Ruby'\nnumbers = [0..10]\n\n'Exclude the end'\nallTheNumbers = [0...4]\n\n'Slicing'\nlog numbers[3..6]\n'Implicit start'\nlog numbers[..3]\n'Implicit end'\nlog numbers[8..]\n\n'Assignment'\nnumbers[3..6] = [400..403]\nlog numbers\n\n'With Variables'\nx = 3\nlog [0..x]\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Create and slice arrays with O(N) less code.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/ranges");

window.require.define({"templates/slides/simple_object_literals": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Simple'\nwow =\n  so: 'you'\n  can: 'just'\n  type: 'stuff'\n\n\n'Nest as deep as you like'\nevenBetter =\n  works: 'with'\n  reserved: 'words'\n  class: 'boom'\n  nesting:\n    is: 'also'\n    cool: 'bro'\n    even: 'with'\n    arrays: [\n      'holy'\n      'moley'\n    ]\n\n'Easy object arrays'\narray1 = [\n  {first: 'object', withAKey: 'key'}\n  {second: 'object', withAKey: 'key'}\n  {third: 'object', withAKey: 'key'}\n]\n\n'or'\n\narray2 = [\n  first: 'object', withAKey: 'key'\n,\n  second: 'object', withAKey: 'key'\n,\n  third: 'object', withAKey: 'key'\n]\n\nlog _.isEqual array1, array2\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Much easier to read and update\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/simple_object_literals");

window.require.define({"templates/slides/string_enhancements": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'String Interpolation'\nbob = \"Bob Mc. Bobbington\"\nlog \"Hello #{bob}\"\n\n'Multiline Strings'\nlog \"I've got a lot to say.\nSo I'm going to say it.\nAcross many lines.\nBut you'll only see one.\"\n\n'Block Strings'\nclassName = 'btn'\nhref = 'http://googles.com.co.uk.tv'\ntitle = 'The Googles'\n\nlog \"\"\"\n  &lt;a href=\"#{href}\" class=\"#{className}\">\n    #{title}\n  &lt;/a>\n  \"\"\"\n\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Less code and easier to read.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/string_enhancements");

window.require.define({"templates/slides/suffix_conditionals": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\nwearingPants = false\ndirty = true\nhaveMeatballSub = true\nitsThursday = true\ndrunk = false\n\nstayInside = -> log \"Pants take a lot of work.\"\ngoOutside = -> log \"I finally put on pants, thank god.\"\ntakeBath = ->\n  log \"The mess will just wash down the drain.\"\n  dirty = false\ngetMaDrinkOn = ->\n  log \"Holy crap, it's THURSDAY\"\n  drunk = true\nhitOnNeighbor = -> log \"I bet she's bored too.\"\n\nstayInside() if not wearingPants\n\ngoOutside() unless haveMeatballSub\n\ntakeBath() if not wearingPants and haveMeatballSub\n\ngetMaDrinkOn() if itsThursday\n\nhitOnNeighbor() if not wearingPants and drunk\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Read code from left to right.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/suffix_conditionals");

window.require.define({"templates/slides/switch_statement": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n'Single Line Action'\nmeme = 'Advice Dog'\n\nswitch meme\n  when 'Advice Dog' then log \"Yep, that's cool\"\n  when 'Keyboard Cat' then log \"Somewhat.\"\n  when 'Rick Rolling' then log 'Sorry but no.'\n\n\n'Multiple Conditions'\ndepartment = 'Architecture'\n\nswitch department\n  when 'Ocean Science'\n    log '$$'\n  when 'Liberal Arts', 'Sociology'\n    log '$$$'\n  when 'Math', 'Engineering', 'Architecture'\n    log '$$$$'\n  when 'Beer Pong'\n    log '...'\n  else\n    log '$'\n\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  A syntax you can love.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/switch_statement");

window.require.define({"templates/slides/ternary_operator": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\nhasFourteenCats = true\nhappy = 'Breaking the Law'\nnotHappy = 'Not Happy'\n\nlog if hasFourteenCats then happy else notHappy\n\ninclusive = 'Inclusive Array'\nlog if [0..5].length > 5 then inclusive else 'Nope'\n");}

function program3(depth0,data) {
  
  
  data.buffer.push("\n  I'm using variables for the responses above to make the lines shorter.\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Readable enough to use.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/ternary_operator");

window.require.define({"templates/slides/variable_scoping": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\nbetterName = (n) ->\n  name = n.toUpperCase()\n  \"#{name} is AWESOME\"\n\nlog betterName 'Duckman'\nlog name\n\nname = 'Dr. Fantastic'\n\nlog name\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  Never leak into the global namespace again.\n</h2>\n");
  foundHelper = helpers.code;
  stack1 = foundHelper || depth0.code;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/variable_scoping");

window.require.define({"templates/slides/what_is_coffeescript": function(exports, require, module) {
  
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, foundHelper, tmp1, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n  <p>\n    The compilation process for CoffeeScript is a huge boon to development.\n    By passing your code through a compiler you can ensure that there aren't\n    any syntax errors before it ever hits the browser.\n  </p>\n");}

  data.buffer.push("<h2 class=\"text-center\">\n  “A little language that compiles into JavaScript”\n</h2>\n\n<ul>\n  <li><em>Readable</em> JavaScript</li>\n  <li>Compiled output passes JavaScript Lint</li>\n  <li>Enforces JavaScript best practicies</li>\n  <li>Created by <a href=\"https://twitter.com/jashkenas\">Jeremy Ashkenas</a>\n  </li>\n</ul>\n\n");
  stack1 = depth0;
  stack2 = "App.NotesView";
  stack3 = helpers.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
});
 module.exports = module.id;
}});
window.moduleNames.push("templates/slides/what_is_coffeescript");

window.require.define({"views/application": function(exports, require, module) {
  
App.ApplicationView = Ember.View.extend({
  templateName: 'templates/application',
  classNames: 'application',
  classNameBindings: 'wiggleLeft wiggleRight'.w(),
  init: function() {
    this._super();
    return $(document).on('keyup', this.documentKeyUp.bind(this));
  },
  resetClasses: function() {
    this.set('wiggleLeft', false);
    return this.set('wiggleRight', false);
  },
  documentKeyUp: function(e) {
    var router;
    if (!App.get('currentSlide')) {
      return;
    }
    router = App.get('router');
    switch (e.which) {
      case 37:
      case 38:
        if (App.get('previousSlide')) {
          return router.goToSlide(router, App.get('previousSlide'));
        } else {
          return this.set('wiggleLeft', true);
        }
        break;
      case 32:
      case 39:
      case 40:
        if (App.get('nextSlide')) {
          return router.goToSlide(router, App.get('nextSlide'));
        } else {
          return this.set('wiggleRight', true);
        }
    }
  }
});

}});
window.moduleNames.push("views/application");

window.require.define({"views/code": function(exports, require, module) {
  var ERROR_REGEX,
  __slice = [].slice;

ERROR_REGEX = /.*?Parse error on line (\d+): (.+)/;

App.CodeView = Ember.View.extend({
  classNames: 'code-view',
  language: 'coffeescript',
  isCodeModified: false,
  didInsertElement: function() {
    var code, codeMirrorOptions, editor,
      _this = this;
    code = $.trim(this.$().text());
    this.$().text('');
    this.set('starterCode', code);
    codeMirrorOptions = {
      lineNumbers: true,
      lineWrapping: false,
      language: 'coffeescript',
      value: code,
      onKeyEvent: function(editor, rawEvent) {
        return jQuery.Event(rawEvent).stopPropagation();
      },
      onChange: function() {
        _this.runCode();
        if (_this.code() !== _this.get('starterCode')) {
          return _this.set('isCodeModified', true);
        } else {
          return _this.set('isCodeModified', false);
        }
      },
      onFocus: function() {
        return _this.set('isFocused', true);
      },
      onBlur: function() {
        return _this.set('isFocused', false);
      },
      extraKeys: {
        Tab: function(cm) {
          return cm.replaceSelection("  ", "end");
        }
      }
    };
    editor = CodeMirror(function(element) {
      return _this.$().append(element);
    }, codeMirrorOptions);
    this.set('editor', editor);
    if (this.get('height') != null) {
      this.setEditorHeight(this.get('height'));
    } else {
      this.fixEditorHeight();
    }
    return this.runCode();
  },
  compileJavaScript: function() {
    var code, compiledJavaScript,
      _this = this;
    code = this.code();
    if (this.get('coffeeScriptCode') === code) {
      return this.get('compiledJavaScript');
    }
    this.set('coffeeScriptCode', code);
    try {
      compiledJavaScript = CoffeeScript.compile(code, {
        bare: true
      });
      this.clearError();
    } catch (error) {
      this.clearError();
      this.displayError(error.message);
    }
    this.set('compiledJavaScript', compiledJavaScript);
    Ember.run.next(function() {
      return _this.set('javaScriptView.code', compiledJavaScript);
    });
    return compiledJavaScript;
  },
  clearError: function() {
    var highlightedLine;
    this.set('lastError', null);
    if (highlightedLine = this.get('highlightedLine')) {
      return this.get('editor').setLineClass(highlightedLine, null, null);
    }
  },
  displayError: function(message) {
    var editor, error, highlightedLine, lineNumber, matches;
    editor = this.get('editor');
    if (matches = message.match(ERROR_REGEX)) {
      lineNumber = parseInt(matches[1]);
      error = matches[2];
      highlightedLine = editor.setLineClass(lineNumber - 1, 'error', 'error');
      this.set('highlightedLine', highlightedLine);
    }
    this.set('lastError', message);
    return this.get('logView').clearLog();
  },
  resetCode: function() {
    return this.setCode(this.get('starterCode'));
  },
  runCode: function(code) {
    return this.evalJavaScript(this.compileJavaScript());
  },
  evalJavaScript: function(code) {
    var argumentNames, boundFunctions, exampleView, exportedFunctions, exportedVariables, fn, logView, valuesAndFunctions, variableValues,
      _this = this;
    try {
      exampleView = this.get('exampleView');
      if (exampleView != null) {
        exportedVariables = exampleView.get('exportedVariables');
        exportedFunctions = exampleView.get('exportedFunctions');
      } else {
        exportedVariables = [];
        exportedFunctions = [];
      }
      variableValues = exportedVariables.map(function(variable) {
        return exampleView.get(variable);
      });
      boundFunctions = exportedFunctions.map(function(functionName) {
        var unboundFunction;
        unboundFunction = exampleView.get(functionName);
        return unboundFunction.bind(exampleView);
      });
      argumentNames = exportedVariables.concat(exportedFunctions);
      valuesAndFunctions = variableValues.concat(boundFunctions);
      logView = this.get('logView');
      argumentNames.pushObject('log');
      valuesAndFunctions.pushObject(logView.get('log').bind(logView));
      if (exampleView != null) {
        exampleView.willRunCode();
      }
      logView.willRunCode();
      if (App.get('config.safeMode')) {
        fn = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Function, __slice.call(argumentNames).concat(['window'], ["" + code]), function(){});
      } else {
        fn = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Function, __slice.call(argumentNames).concat(["" + code]), function(){});
      }
      return fn.apply(null, valuesAndFunctions);
    } catch (error) {
      this.clearError();
      return this.displayError(error.message);
    } finally {
      if (exampleView != null) {
        exampleView.didRunCode();
      }
      logView.didRunCode();
    }
  },
  code: function() {
    return this.get('editor').getValue();
  },
  setCode: function(code) {
    return this.get('editor').setValue($.trim(code));
  },
  setEditorHeight: function(height) {
    var $scroller, $wrapper, editor;
    editor = this.get('editor');
    $scroller = $(editor.getScrollerElement());
    $scroller.height(height);
    $wrapper = $(editor.getWrapperElement());
    return $wrapper.height(height);
  },
  fixEditorHeight: function() {
    return this.setEditorHeight($(this.get('editor').getScrollerElement()).height());
  },
  exportedVariablesBinding: 'exampleView.exportedVariables',
  exportedFunctionsBinding: 'exampleView.exportedFunctions',
  hasError: (function() {
    return !!this.get('lastError');
  }).property('lastError')
});

}});
window.moduleNames.push("views/code");

window.require.define({"views/code_and_example": function(exports, require, module) {
  
App.CodeAndExampleView = Ember.ContainerView.extend({
  classNames: 'code-and-example',
  init: function() {
    this._super();
    if (this.get('parentView.preview')) {
      return this.addAndSaveView(App.FakeCodeView.create({
        hasCodeExample: !!this.get('exampleViewClassName')
      }), 'fakeCodeView');
    } else {
      this.addAndSaveView(App.CodeEditorAndStatusBarView.create({
        template: this.get('template'),
        language: this.get('language'),
        height: this.getWithDefault('height', 400),
        noToolbar: this.get('noToolbar')
      }), 'codeEditorView');
      this.addAndSaveView(App.JavaScriptView.create({
        height: this.getWithDefault('height', 400)
      }), 'javaScriptView');
      this.set('codeEditorView.codeView.javaScriptView', this.get('javaScriptView'));
      this.addAndSaveView(App.LogView.create(), 'logView');
      return this.set('codeEditorView.codeView.logView', this.get('logView'));
    }
  },
  addAndSaveView: function(view, name) {
    this.set(name, view);
    this.get('childViews').pushObject(view);
    return view;
  }
});

}});
window.moduleNames.push("views/code_and_example");

window.require.define({"views/code_editor": function(exports, require, module) {
  
App.CodeEditorAndStatusBarView = Ember.ContainerView.extend({
  classNames: 'code-and-status-bar',
  classNameBindings: 'codeView.isFocused:focused codeView.language\
    noToolbar'.w(),
  init: function() {
    this._super();
    this.addAndSaveView(App.CodeView.create({
      template: this.get('template'),
      language: this.get('language'),
      height: this.get('height')
    }), 'codeView');
    if (this.get('noToolbar')) {
      return;
    }
    return this.addAndSaveView(App.CodeToolbarView.create({
      codeView: this.get('codeView')
    }), 'toolbarView');
  },
  addAndSaveView: function(view, name) {
    this.set(name, view);
    this.get('childViews').pushObject(view);
    return view;
  }
});

}});
window.moduleNames.push("views/code_editor");

window.require.define({"views/code_toolbar": function(exports, require, module) {
  
App.CodeToolbarView = Ember.View.extend({
  templateName: 'templates/code_toolbar',
  classNames: 'code-toolbar',
  classNameBindings: 'isFocused:focused language'.w(),
  resetCode: function() {
    return this.get('codeView').resetCode();
  },
  languageBinding: 'codeView.language',
  isCoffeeScriptBinding: 'codeView.isCoffeeScript',
  isJavaScriptBinding: 'codeView.isJavaScript',
  isFocusedBinding: 'codeView.isFocused',
  isCodeModifiedBinding: 'codeView.isCodeModified',
  hasErrorBinding: 'codeView.hasError',
  exportedVariablesBinding: 'codeView.exportedVariables',
  exportedFunctionsBinding: 'codeView.exportedFunctions',
  message: (function() {
    var string;
    string = '';
    if ((this.get('exportedVariables') != null) && this.get('exportedVariables.length')) {
      string += "Variables: " + (this.get('exportedVariables').join(','));
    }
    if ((this.get('exportedFunctions') != null) && this.get('exportedFunctions.length')) {
      string += "Functions: " + (this.get('exportedFunctions').join(','));
    }
    return string;
  }).property('exportedVariables'),
  errorMessage: (function() {
    if (this.get('hasError')) {
      return this.get('codeView.lastError');
    } else {
      return '&nbsp;';
    }
  }).property('codeView.lastError'),
  canResetCode: (function() {
    return this.get('isCodeModified') && this.get('isCoffeeScript');
  }).property('isCodeModified', 'language')
});

}});
window.moduleNames.push("views/code_toolbar");

window.require.define({"views/examples/container": function(exports, require, module) {
  
App.ExampleContainerView = Ember.ContainerView.extend({
  classNames: 'example-container-view',
  exportedVariables: 'containerView'.w(),
  exportedFunctions: [],
  didRunCode: Ember.K,
  willRunCode: function() {
    return this.get('childViews').clear();
  },
  containerView: (function() {
    return this;
  }).property()
});

}});
window.moduleNames.push("views/examples/container");

window.require.define({"views/examples/example": function(exports, require, module) {
  
App.ExampleView = Ember.View.extend({
  exportedVariables: [],
  exportedFunctions: [],
  willRunCode: Ember.K,
  didRunCode: Ember.K
});

}});
window.moduleNames.push("views/examples/example");

window.require.define({"views/examples/javascript": function(exports, require, module) {
  
require('views/examples/example');

App.JavaScriptView = App.ExampleView.extend({
  classNames: 'javascript-output code-view javascript',
  height: 300,
  code: '',
  didInsertElement: function() {
    var code, codeMirrorOptions, editor, finalHeight, height,
      _this = this;
    code = $.trim(this.$().text());
    this.$().text('');
    this.set('starterCode', code);
    codeMirrorOptions = {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      readOnly: true,
      value: code,
      onKeyEvent: function(editor, rawEvent) {
        return jQuery.Event(rawEvent).stopPropagation();
      }
    };
    editor = CodeMirror(function(element) {
      return _this.$().append(element);
    }, codeMirrorOptions);
    this.set('editor', editor);
    height = parseInt(this.get('height'));
    finalHeight = height + 18;
    return this.setEditorHeight(finalHeight);
  },
  setEditorHeight: function(height) {
    var $scroller, $wrapper, editor;
    editor = this.get('editor');
    $scroller = $(editor.getScrollerElement());
    $scroller.height(height);
    $wrapper = $(editor.getWrapperElement());
    return $wrapper.height(height);
  },
  observesCode: (function() {
    return this.setCode(this.get('code'));
  }).observes('code'),
  setCode: function(code) {
    var _ref;
    return (_ref = this.get('editor')) != null ? _ref.setValue($.trim(code).replace(/(\n\n\n)/gm, '\n')) : void 0;
  }
});

}});
window.moduleNames.push("views/examples/javascript");

window.require.define({"views/examples/log": function(exports, require, module) {
  var __slice = [].slice;

require('views/examples/example');

App.LogView = App.ExampleView.extend({
  classNames: 'log',
  exportedFunctions: 'log'.w(),
  templateName: 'templates/examples/log',
  init: function() {
    this._super();
    return this.set('logMessages', []);
  },
  log: function() {
    var objects, objectsString,
      _this = this;
    objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    objectsString = objects.map(function(object) {
      return _this.variableToString(object);
    }).join(', ');
    this.get('logMessages').pushObject(objectsString);
    return null;
  },
  variableToString: function(variable) {
    var count, emberType, maxPairs, string;
    emberType = Ember.typeOf(variable);
    if ((variable != null) && typeof variable === 'object' && (emberType === 'object' || emberType === 'instance')) {
      maxPairs = 4;
      count = 0;
      string = Ember.keys(variable).map(function(key) {
        count++;
        if (count > maxPairs) {
          return;
        }
        if (variable instanceof Ember.Object) {
          return "" + key + ": " + (variable.get(key));
        } else {
          return "" + key + ": " + variable[key];
        }
      }).join(', ');
      if (count > maxPairs) {
        string += '...';
      }
      string = "{" + string + "}";
    } else if (emberType === 'array') {
      string = variable.map(this.variableToString).join(', ');
      string = "[" + string + "]";
    } else if (emberType === 'string') {
      string = "\"" + variable + "\"";
    } else if (variable != null) {
      string = variable.toString();
    } else {
      string = variable;
    }
    return string;
  },
  willRunCode: function() {
    return this.clearLog();
  },
  clearLog: function() {
    return this.get('logMessages').clear();
  },
  logMessagesText: (function() {
    var lineNumber;
    lineNumber = 0;
    return this.get('logMessages').map(function(message) {
      lineNumber++;
      return "" + lineNumber + "> " + message;
    }).join('\n');
  }).property('logMessages.@each')
});

}});
window.moduleNames.push("views/examples/log");

window.require.define({"views/fake_code": function(exports, require, module) {
  
App.FakeCodeView = Ember.View.extend({
  classNames: 'fake-code',
  templateName: 'templates/fake_code'
});

}});
window.moduleNames.push("views/fake_code");

window.require.define({"views/notes": function(exports, require, module) {
  
App.NotesView = Ember.View.extend({
  tagName: 'section',
  classNames: 'slide-notes',
  classNameBindings: 'shown'.w(),
  shownBinding: 'App.config.showNotes'
});

}});
window.moduleNames.push("views/notes");

window.require.define({"views/slide": function(exports, require, module) {
  
App.SlideView = Ember.View.extend({
  classNames: 'slide',
  templateName: 'templates/slide',
  didInsertElement: function() {
    var _this = this;
    if (this.get('preview')) {
      return this.$().parent().on('touchend', function() {
        return App.router.send('goToSlide', _this.get('content'));
      });
    }
  },
  willDestroyElement: function() {
    return this.$().parent().off('touchend');
  }
});

}});
window.moduleNames.push("views/slide");

window.require.define({"views/slide_container": function(exports, require, module) {
  
App.SlideContainerView = Ember.View.extend({
  templateName: 'templates/slide_container'
});

}});
window.moduleNames.push("views/slide_container");

window.require.define({"views/slide_content": function(exports, require, module) {
  
App.SlideContentView = Ember.View.extend({
  tagName: 'section',
  classNames: 'slide-content',
  templateNameBinding: 'content.templatePath',
  previewBinding: 'parentView.preview'
});

}});
window.moduleNames.push("views/slide_content");

window.require.define({"views/slides": function(exports, require, module) {
  
App.SlidesView = Ember.View.extend({
  templateName: 'templates/slides',
  tagName: 'section',
  classNames: 'slides'
});

}});
window.moduleNames.push("views/slides");

