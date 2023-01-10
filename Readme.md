# Expandables-js

A plugin for creating and managing collapsible content areas like F.A.Qs. 

<br>

**Table of contents** 
- [Installation](#installation)
- Examples
    - [Basic Usage](#basic-usage)
    - [Accordion Group](#accordion-group)
    - [Custom Trigger Events](#trigger-events)
    - [Custom Callbacks](#custom-callback)
- [Public Methods](#public-methods) 
    - Expandables - Class
        - .collapseAll()
        - .expandAll()
        - .getExpandable()
        - .getExpandables()
        - .destroyExpandables()
        - .registerExpandable()
    - Expandable - Instance 
        - .toggle()
        - .collapse()
        - .expand()
        - .isExpanded()
    - InitExpandables()
- [HTML Attributes](#html-attributes)
    - Body Attributes
    - Containers
    - Groups 
    - Triggers 
    - Target 
    - Options

<br>

---

## Installation

<br>

You can use NPM to download package into your project 
```
npm install expandables-js
```
OR you can import the module directly in your project with ES6 Modules

```HTML
<script type="module">
    import { Expandables, initExpandables } from './expandables-js/expandables.js';
</script>
```

<br>

---

## Basic Usage
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/expandables-js/tree/main/demo) in repo for complete example

<br>

**CSS**
```HTML
<link rel="stylesheet" href="./expandables-js/expandables.css">
```

**HTML**
```HTML
<div data-expandable-container="collapsed">
    <button data-expandable-trigger>></button>
    <p>Uncollapsed content here</p>
    <div data-expandable-target>
        <p>Hidden content here</p>
    </div>
</div>
```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import {Expandables, initExpandables} from '/expandables-js/expandables.js';

    // Initialize Plugin
    initExpandables(); 
</script>
```

<br>

---

## Accordion Group
See [*'/demo/accordion-group.html'*](https://github.com/jvuzzell/expandables-js/tree/main/demo) in repo for complete example

<br>

**HTML**
```HTML
<div data-expandable-group>
    <div data-expandable-container="expanded">
        <button data-expandable-trigger>></button>
        <p>Uncollapsed content here</p>
        <div data-expandable-target>
            <p>Hidden content here</p>
        </div>
    </div>

    <div data-expandable-container="collapsed">
        <button data-expandable-trigger>></button>
        <p>Uncollapsed content here</p>
        <div data-expandable-target>
            <p>Hidden content here</p>
        </div>
    </div>

    <div data-expandable-container="collapsed">
        <button data-expandable-trigger>></button>
        <p>Uncollapsed content here</p>
        <div data-expandable-target>
            <p>Hidden content here</p>
        </div>
    </div>
</div>
```

<br>

---

## Custom Trigger Event
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/expandables-js/tree/main/demo) in repo for complete example

<br>

By default the trigger event for modals is a click event. However, you can use other events by updating the **[data-expandable-trigger]** attribute. 

<br>

**HTML**
```HTML
<div data-expandable-container="expanded">
    <button data-expandable-trigger="mouseover">></button>
    <p>Uncollapsed content here</p>
    <div data-expandable-target>
        <p>Hidden content here</p>
    </div>
</div>
```
<br>

---

## Custom Callback
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/expandables-js/tree/main/demo) in repo for complete example

<br>

The default event for triggering expandable expansion can be overwritten by adding [data-expandable-override] and [data-expandable-callback] attributes to the expandable trigger. If you a developer does this, they become responsible for toggling the expandable expansion exchange for being able to add custom behavior around the interaction.

<br>

**HTML**
```HTML
<div data-expandable-container="collapsed" data-expandable-override=true data-expandable-callback="exampleCallback">
    <button data-expandable-trigger>></button>
    <p>Uncollapsed content here</p>
    <div data-expandable-target>
        <p>Hidden content here</p>
    </div>
</div>

```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import { Expandables, initExpandables } from './expandables-js/expandables.js'; 

    // Initialize Plugin
    initExpandables();

    // Custom callback where the developer has to trigger the expandable's visibility 
    window.exampleCallback = ( event ) => {
        let expandableId = event.target.getAttribute( 'data-expandable-id' ); 
        Expandables.getExpandable( expandableId ).toggle(); 
        alert( 'Custom callback triggered on ' + expandableId + '; expanded = ' + Expandables.getExpandable( expandableId ).getSettings().expanded );
    } 
</script>
```

<br>

---

## Public Methods

<br>

|Object|Method|Description|
|---|---|---|
|Expandables|.collapseAll()|Collapses all expandables outside of accordions|
||.expandAll()|Expands all expandables outside of accordions|
||.getExpandable( name )| Expected string to equal value of [data-expandable-target] attribute on expandable HTML element. Returns single HTML element for corresponding expandable.  |
||.getExpandables()|Returns HTMLCollection of all expandables.|
||.destroyExpandables()|Destroys all Expandable instances but leaves HTML elements in place|
||.registerExpandable( HTMLelement )|Expected HTML element; Takes an HTML element representing the expandable. The attributes are read from the expandable element and used to build a expandable instance.|
|Expandable|.toggle()|Toggles the value of the data attribute [data-expandable-container] between "collapsed" and "expanded"|
||.collapse()|Changes the value of the data attribute [data-expandable-container] to "collapsed"|
||.expand()|Changes the value of the data attribute [data-expandable-container] to "expanded"|
||.isExpanded()|Returns boolean of true or false representing whether the expandable is expanded or collapsed| 
|initExpandables()||Initializes expandables in the document by calling the Expandables.registerExpandable() HTML element.|

<br>

---

## HTML Attribute

<bR>

| HTML Element | Attribute | Description |
|--------------|-----------|-------------|
(Pending)