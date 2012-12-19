App.CodeToolbarView = Ember.View.extend
  templateName: 'templates/code_toolbar'
  classNames: 'code-toolbar'
  classNameBindings: 'isFocused:focused language'.w()

  # ------------
  # User Actions
  # ------------

  resetCode: ->
    @get('codeView').resetCode()

  # -------------------
  # Computed Properties
  # -------------------

  languageBinding: 'codeView.language'
  isCoffeeScriptBinding: 'codeView.isCoffeeScript'
  isJavaScriptBinding: 'codeView.isJavaScript'
  isFocusedBinding: 'codeView.isFocused'
  isCodeModifiedBinding: 'codeView.isCodeModified'
  hasErrorBinding: 'codeView.hasError'
  exportedVariablesBinding: 'codeView.exportedVariables'
  exportedFunctionsBinding: 'codeView.exportedFunctions'

  message: (->
    string = ''
    if @get('exportedVariables')? and @get('exportedVariables.length')
      string += "Variables: #{@get('exportedVariables').join(',')}"
    if @get('exportedFunctions')? and @get('exportedFunctions.length')
      string += "Functions: #{@get('exportedFunctions').join(',')}"

    string
  ).property('exportedVariables')

  errorMessage: (->
    if @get('hasError')
      @get('codeView.lastError')
    else
      '&nbsp;'
  ).property('codeView.lastError')

  # Public: Can only reset code in coffeescript mode when the code is changed.
  canResetCode: (->
    @get('isCodeModified') and @get('isCoffeeScript')
  ).property('isCodeModified', 'language')
