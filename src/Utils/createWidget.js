function createWidget(user) {
  var widget = document.createElement('div')
  var img = document.createElement('div')
  var name = document.createElement('div')
  
  widget.className = 'widget';
  widget.style.display = 'flex';
  widget.style.justifyContent = 'center';
  widget.style.width = 'max-content';
  widget.style.height = '12px';
  widget.style.borderRadius = "3px";
  widget.style.background = user.color;

  img.className = 'widgetImg';
  img.style.width = '15px';
  img.style.height = '15px';
  img.style.border = `1px solid ${user.color}`;
  img.style.borderRadius = '50%';
  img.style.backgroundImage = 'url(' + user?.photos[0].value + ')';
  img.style.backgroundSize = 'cover';

  name.className = 'widgetName';
  name.innerHTML = user.name.givenName;
  name.style.display = 'flex';
  name.style.alignItems = 'center';
  name.style.justifyContent = 'center';
  name.style.color = 'black';
  name.style.opacity = 1;
  name.style.fontSize = '10px';
  name.style.padding = '0 3px';
  console.log(widget);
  widget.append(img,name);
  return widget;
}

export {createWidget};