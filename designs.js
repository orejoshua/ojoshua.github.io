// constants to hold major DOM elements
const GRID = $('#pixelCanvas');
const COLORPICKER = $('#colorPicker');

// Major function 1: makeGrid
function makeGrid() {
  /**
  * Function to generage grid when submit button is clicked.
  * It adjusts the grid size without clearing its content when new grid height
  * and grid width are specified and the submit button is clicked.
  * When the submit button is clicked with the same grid height and grid width
  * specified, the grid content are cleared.
  **/
  // prevent HTTP request
  event.preventDefault();

  // Get old and new height and width
  let oldHeight = GRID.children().length;
  let oldWidth = (oldHeight === 0) ? 0 : GRID.children().first().children().length;
  let newHeight = $('#inputHeight').val();
  let newWidth = $('#inputWeight').val();

  // function definitions
  function deleteCol(index){
    /**
    * function to delete a grid column
    **/
    let items = $('.td' + index);
    items.remove();
  }

  function insertCol(index, parents = $('#pixelCanvas').children()){
    /**
    * function to insert columns in each and all grid rows
    **/
    parents.append('<td class="td' + index + '"></td>');
  }

  function deleteRow(index){
    /**
    * function to delete a grid row
    **/
    let id = '#tr' + index;
    $(id).remove();
  }

  function insertRow(index){
    /**
    * function to insert a row in grid
    **/
    let id = 'tr' + index;
    GRID.append('<tr id="' + id + '"></tr>');

    let parent = $('#'+id);
    for(let i = 0; i < newWidth; i++){
      insertCol(i, parent);
    }
  }

  function adjust(oldValue, newValue, insertFunction, deleteFunction){
    /**
    * Called by adjustCol and adjustRow functions.
    * Abstracts away similar code behaviour in the two funtions.
    * It either inserts or deletes a row or column from the grid
    **/
    if(oldValue > newValue){
      for(let i = newValue; i <= oldValue; i++){
        deleteFunction(i);
      }
    } else if (oldValue < newValue) {
      let i = oldValue;
      while(i < newValue){
        insertFunction(i);
        i++;
      }
    }
  }

  function adjustCol(){
    /**
    * Adjusts the grid columns
    * It either inserts or deletes a column from the grid
    **/
    adjust(oldWidth, newWidth, insertCol, deleteCol);
  }

  function adjustRow(){
    /**
    * Adjusts the grid rows
    * It either inserts or deletes a row from the grid
    **/
    adjust(oldHeight, newHeight, insertRow, deleteRow);
  }

  function clearGrid(){
    /**
    * Clears the content of the grid by resetting its background color to
    * transparent
    **/
    let rows = GRID.children('tr');

    $(rows).each(function(i){
      let cols = $(rows[i]).children('td');
      $(cols).each(function(j){
        $(cols[j]).css('background-color', 'transparent');
      });
    });
  }

  // Start of logical execution when submit button is clicked
  if(!(oldHeight == newHeight && oldWidth == newWidth)){
    // A table of a different size is requested.
    // Current table is to be adjusted.
    adjustCol();
    adjustRow();
  } else {
    // A table of the same size is requested.
    // Current table is to be cleared.
    clearGrid();
  }


}

// Major function 1: colorGrid
function colorGrid(event){
  /**
  * Function to modify the color of a grid cell when it is clicked.
  * It sets the color of the grid cell to the color selected in the colour picker
  * when the grid has no color or has a color different from the one selected.
  * It clears the grid (makes it transparent) when the current grid color is
  * the same as the selected color.
  **/
  function hexToRGB(hex){
    /**
    * Function to convert color in hexcode to RGB format.
    * Courtesy: StackOverflow user 'Paulpro'
    **/
    let pattern = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    let matches = pattern.exec(hex);
    let rgb = 'rgb('+parseInt(matches[1], 16)+', '+parseInt(matches[2], 16)+', '+parseInt(matches[3], 16)+')';
    return rgb;
  }

  // variables to hold old and new colors for comparison
  let oldColor = $(event.target).css('background-color');
  let newColor = hexToRGB(COLORPICKER.val());

  if(oldColor !== newColor){
    $(event.target).css('background-color', newColor);
  } else {
    $(event.target).css('background-color', 'transparent');
  }
}

// event listeners for the submit button and the grid
$(':submit').click(makeGrid);
$(GRID).click(colorGrid);
