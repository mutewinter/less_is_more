# Public: A view containing a code editor and an example view. Expects to be
# created by the {{code}} helper with the template set to the code that will be
# passed to the CodeEditorView.
App.CodeAndExampleView = Ember.ContainerView.extend
  classNames: 'code-and-example'

  init: ->
    @_super()

    if @get('parentView.preview')
      # The fake code view to show when the slide is in preview mode. We
      # do this so we don't render all of the code views on the homepage (which can
      # cause unwanted side-effects since the code views excute code).
      @addAndSaveView(App.FakeCodeView.create(
        hasCodeExample: !!@get('exampleViewClassName')
      ), 'fakeCodeView')
    else
      # We pass our template along to the child so it can render the code
      # contained within the {{code}} tag.
      @addAndSaveView(App.CodeEditorAndStatusBarView.create(
        template: @get('template')
        language: @get('language')
        height: @getWithDefault('height', 400)
        noToolbar: @get('noToolbar')
      ), 'codeEditorView')

      @addAndSaveView(App.JavaScriptView.create(
        height: @getWithDefault('height', 400)
      ), 'javaScriptView')
      @set('codeEditorView.codeView.javaScriptView', @get('javaScriptView'))

      @addAndSaveView(App.LogView.create(), 'logView')
      @set('codeEditorView.codeView.logView', @get('logView'))

  # Internal: Push the view on the childViews stack and save it locally with
  # the given name.
  #
  # view - An instantied Ember.View subclass.
  # name - A string name to store the view under.
  #
  # Returns the view object.
  addAndSaveView: (view, name) ->
    @set name, view
    @get('childViews').pushObject view
    view
