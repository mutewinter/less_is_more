# Public: A view containing code that should be made editable with CodeMirror.
ERROR_REGEX = /.*?Parse error on line (\d+): (.+)/

App.CodeView = Ember.View.extend
  classNames: 'code-view'

  # Defaults
  language: 'coffeescript'
  isCodeModified: false

  # ------------
  # Ember Events
  # ------------

  # Internal: Callback that is called when the element is in the DOM and we
  # are free to modify it with external JavaScript.
  #
  # Returns nothing.
  didInsertElement: ->
    # Trim the trailing and leading whitespace from the code before we draw it.
    code = $.trim @$().text()
    @$().text('')
    @set('starterCode', code)

    codeMirrorOptions =
      lineNumbers: true
      lineWrapping: true
      language: 'coffeescript'
      value: code
      onKeyEvent: (editor, rawEvent) =>
        # Keep this event from triggering a slide change.
        jQuery.Event(rawEvent).stopPropagation()
      onChange: =>
        @runCode()

        if @code() != @get('starterCode')
          @set('isCodeModified', true)
        else
          @set('isCodeModified', false)
      onFocus: => @set('isFocused', true)
      onBlur: => @set('isFocused', false)
      extraKeys:
        Tab: (cm) -> cm.replaceSelection("  ", "end")


    editor = CodeMirror((element) =>
      @$().append(element)
    , codeMirrorOptions)
    @set('editor', editor)

    if @get('height')?
      @setEditorHeight(@get('height'))
    else
      @fixEditorHeight()

    @runCode()

  # ---------------
  # Code Conversion
  # ---------------

  compileJavaScript: ->
    code = @code()
    return @get('compiledJavaScript') if @get('coffeeScriptCode') == code

    # Save the CoffeeScript so we can swith back to it later.
    @set('coffeeScriptCode', code)

    try
      compiledJavaScript = CoffeeScript.compile(code, bare: on)
      @clearError()
    catch error
      @clearError()
      @displayError(error.message)

    @set('compiledJavaScript', compiledJavaScript)

    # Must run this in next since there's a change that javaScriptView isn't
    # defined when this method is run.
    Ember.run.next =>
      @set('javaScriptView.code', compiledJavaScript)

    compiledJavaScript

  # Internal: Clear the error message since we compiled successfully.
  #
  # Returns nothing.
  clearError: ->
    @set('lastError', null)

    if highlightedLine = @get('highlightedLine')
      @get('editor').setLineClass(highlightedLine, null, null)

  # Internal: Display a CoffeeScript compilation error message.
  #
  # Returns nothing.
  displayError: (message) ->
    editor = @get('editor')

    if matches = message.match(ERROR_REGEX)
      lineNumber = parseInt(matches[1])
      error = matches[2]
      highlightedLine = editor.setLineClass(lineNumber - 1, 'error', 'error')
      @set('highlightedLine', highlightedLine)

    @set('lastError', message)
    @get('logView').clearLog()

  # Public: Resets the code example back to what it was when the slide first
  # loaded.
  resetCode: ->
    @setCode(@get('starterCode'))

  # ---------------
  # Code Evaluation
  # ---------------

  runCode: (code) ->
    @evalJavaScript(@compileJavaScript())

  # Eval the compiled js.
  evalJavaScript: (code) ->
    try
      exampleView = @get('exampleView')

      if exampleView?
        exportedVariables = exampleView.get('exportedVariables')
        exportedFunctions = exampleView.get('exportedFunctions')
      else
        exportedVariables = []
        exportedFunctions = []

      # Make arrays of the variable values and functions so we can pass them
      # as arguments later.

      variableValues = exportedVariables.map (variable) =>
        exampleView.get(variable)
      boundFunctions = exportedFunctions.map (functionName) ->
        unboundFunction = exampleView.get(functionName)
        unboundFunction.bind(exampleView)

      argumentNames = exportedVariables.concat(exportedFunctions)
      valuesAndFunctions = variableValues.concat(boundFunctions)

      # Always add the logView
      logView = @get('logView')
      argumentNames.pushObject 'log'
      valuesAndFunctions.pushObject logView.get('log').bind(logView)

      exampleView?.willRunCode()
      logView.willRunCode()

      if App.get('config.safeMode')
        fn = (new Function(argumentNames...,'window', "#{code}"))
      else
        fn = (new Function(argumentNames...,"#{code}"))

      # We setup the arguments to the function above, now we pass the values
      # for those arguments in as arguments to make them live within the
      # anonymous function.
      fn(valuesAndFunctions...)
    catch error
      @clearError()
      @displayError(error.message)
    finally
      exampleView?.didRunCode()
      logView.didRunCode()

  # -------
  # Helpers
  # -------

  code: -> @get('editor').getValue()
  setCode: (code) -> @get('editor').setValue($.trim code)

  # Internal: Set the height of the editor and its scroller element.
  #
  # Returns nothing.
  setEditorHeight: (height) ->
    editor = @get('editor')
    $scroller = $(editor.getScrollerElement())
    $scroller.height(height)
    $wrapper = $(editor.getWrapperElement())
    $wrapper.height(height)

  # Internal: Fixes the editor's height to its current value.
  #
  # Returns nothing.
  fixEditorHeight: ->
    @setEditorHeight $(@get('editor').getScrollerElement()).height()

  # -------------------
  # Computed Properties
  # -------------------

  exportedVariablesBinding: 'exampleView.exportedVariables'
  exportedFunctionsBinding: 'exampleView.exportedFunctions'

  # Public: We are in the error state if we haven't cleared the last error.
  hasError: (->
    !!@get('lastError')
  ).property('lastError')
