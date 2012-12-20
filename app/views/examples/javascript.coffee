require('views/examples/example')

# Public: A view
App.JavaScriptView = App.ExampleView.extend
  classNames: 'javascript-output code-view javascript'

  # Defaults
  height: 300
  code: ''

  didInsertElement: ->
    # Trim the trailing and leading whitespace from the code before we draw it.
    code = $.trim @$().text()
    @$().text('')
    @set('starterCode', code)

    codeMirrorOptions =
      lineNumbers: true
      lineWrapping: true
      mode: 'javascript'
      readOnly: true
      value: code
      onKeyEvent: (editor, rawEvent) =>
        # Keep this event from triggering a slide change.
        jQuery.Event(rawEvent).stopPropagation()

    editor = CodeMirror((element) =>
      @$().append(element)
    , codeMirrorOptions)
    @set('editor', editor)

    height = parseInt(@get('height'))

    # Final height takes the status bar into account for the CoffeeScript view
    # that sits next to this view.
    finalHeight = height + 18

    @setEditorHeight(finalHeight)

  # Internal: Set the height of the editor and its scroller element.
  #
  # Returns nothing.
  setEditorHeight: (height) ->
    editor = @get('editor')
    $scroller = $(editor.getScrollerElement())
    $scroller.height(height)
    $wrapper = $(editor.getWrapperElement())
    $wrapper.height(height)

  observesCode: (->
    @setCode @get('code')
  ).observes('code')

  setCode: (code) -> @get('editor')?.setValue(
    $.trim(code)
    .replace(/(\n\n\n)/gm, '\n') # Remove double empty newlines
  )
