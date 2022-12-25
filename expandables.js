export let Expandables = (() => {

    let store = {};
  
    let Constructor = function( options ) {

        let publicMethods = {};
        let settings; 

        // Private
        const expand = ( target ) => {
            let targetHeight = target.scrollHeight;
            publicMethods.updateState( { 'expanded' : true } );
            target.style.height = targetHeight + 'px';
        }

        const collapse = ( target ) => {
            let targetHeight = target.scrollHeight;
            publicMethods.updateState( { 'expanded' : false } );

            let targetTransition = target.style.transition;
            target.style.transition = '';

            requestAnimationFrame(() => {
                target.style.height = targetHeight + 'px';
                target.style.transition = targetTransition;

                requestAnimationFrame(() => {
                    target.style.height = 0 + 'px';
                })
            });      
        }

        const collapseSiblings = ( targetGroup ) => {
            let prevTargetContainers = targetGroup.querySelectorAll( '[data-expandable-container="expanded"]' );
            if ( prevTargetContainers.length === 0 ) return;

            for (let i = 0; i < prevTargetContainers.length; i++) {
                let prevTarget = prevTargetContainers[i].querySelector( '[data-expandable-target]' );

                collapse( prevTarget );
                prevTargetContainers[i].setAttribute( 'data-expandable-container', 'collapsed' ); 
            }
        }

        // Public
        publicMethods.toggle = () => {
            if( settings.container.getAttribute( 'data-expandable-container' ) == 'collapsed' ) {
                if( settings.targetGroup !== null ) collapseSiblings( settings.targetGroup );  
                expand( settings.target );
                settings.container.setAttribute( 'data-expandable-container', 'expanded' ); 
            } else {
                if( settings.targetGroup !== null ) collapseSiblings( settings.targetGroup );  
                collapse( settings.target ); 
                settings.container.setAttribute( 'data-expandable-container', 'collapsed' );
            }        
        }
                
        publicMethods.init = async ( options ) => {

            if( store[ options.id ] !== undefined ) return;

            settings = options; // This makes arguments available in the scope of other methods within this object

            if( settings == null || settings == undefined ) { console.error( 'Expandables Plugin, settings not provided upon initialization' ); return; } 

            let trigger      = settings.trigger;
            let triggerEvent = trigger.getAttribute( 'data-expandable-trigger' ); 

            triggerEvent = ( triggerEvent !== undefined && triggerEvent !== '' ) ? triggerEvent : 'click'; 
            settings.triggerEvent = triggerEvent;

            await trigger.setAttribute( 'data-expandable-id', settings.id );

            if( settings.override === 'true' ) {

                try {
                    settings.callback = ( event ) => {
                        if( event.target.getAttribute( 'data-expandable-id' ) === trigger.dataset.expandableId ) {  
                            let thisExpandableSettings = Expandables.getExpandable( settings.id ).getSettings();  
                            window[ thisExpandableSettings.customCallback ]( event );
                        }
                    }; 

                    window.addEventListener( triggerEvent, settings.callback );                 
                } catch( error ) {
                    console.error( 'Expandables Plugin, setting ' + settings.id + ' expandable custom callback failed: ' + error.message );
                }

            } else {
 
                settings.callback = ( event ) => {  
                    if( event.target.getAttribute( 'data-expandable-id' ) === trigger.dataset.expandableId ) {
                        Expandables.getExpandable( settings.id ).toggle();
                    }
                } 

                window.addEventListener( triggerEvent, settings.callback ); 

            }

            if( !settings.expanded ) {
                collapse( settings.target );
            }
            
        };

        publicMethods.updateState = ( state ) => {
            
            for( let setting in state ) {
                settings[ setting ] = state[ setting ];
            }

        }
        
        publicMethods.getSettings = () => {
            return settings;
        }

        publicMethods.isExpanded = () => {
            return settings.expanded;
        }

        // Initialize plugin
        publicMethods.init( options );
        return publicMethods;

    }

    const setExpandable = ( name, obj ) => {
        if( store[ name ] !== undefined ) return;
        store[ name ] = obj;
    }

    const getExpandable = ( name ) => {
        return store[ name ];
    }
	
    const getExpandables = () => {
        return store;
    }	

    const destroyExpandables = () => { 
        for( const expandableId in store ) {
            let settings = getExpandable( expandableId ).getSettings(); 
            let callbackName = settings.callback;  
            let triggerEvent = settings.triggerEvent; 
            window.removeEventListener( triggerEvent, callbackName );
        }
        store = {};
    }

    const registerExpandable = function( expandable, iterator ) {

        let expandableTarget   = expandable.querySelector( '[data-expandable-target]' );
        let expandableName     = ( expandableTarget.getAttribute( 'data-expandable-target' ) !== '' ) ? expandableTarget.getAttribute( 'data-expandable-target' ) : 'expandable_' + iterator;
        let expandableTrigger  = expandable.querySelector( '[data-expandable-trigger]' );
        let expandableGroup    = findAncestor( expandable, '[data-expandable-group]' );
        let isExpanded         = ( expandable.getAttribute( 'data-expandable-container' ) == 'collapsed' ) ? false : true;
        let expandableOverride = expandable.getAttribute( 'data-expandable-override' );
        let expandableCallback = null;
        let callbackName;             
    
        if( expandableOverride === "true" ) {
            callbackName = expandable.getAttribute( 'data-expandable-callback' );  
            expandableCallback = ( callbackName === undefined ) ? null : callbackName; // string, name of function to call
            if( expandableCallback == null ) { console.warn( 'Expandables Plugin did not detect custom callback for override, Node:', expandable ); } 
        }
    
        if( expandableTarget == null ) { console.warn( 'Expandables Plugin did not detect target, Node:', expandable ); }
        if( expandableTrigger == null ) { console.warn( 'Expandables Plugin did not detect trigger, Node:', expandable ) ; }
    
        this.storeExpandable( 
            expandableName,
            new Expandables.build({
                id               : expandableName,
                container        : expandable, 
                trigger          : expandableTrigger, 
                target           : expandableTarget, 
                targetGroup      : expandableGroup, 
                override         : expandableOverride, 
                customCallback   : expandableCallback, 
                expanded         : isExpanded
            })
        );  
            
        function findAncestor(el, sel) {
            while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
            return el;
        }
    
    }

    return { 
        build              : Constructor, 
        registerExpandable : registerExpandable, 
        storeExpandable    : setExpandable, 
        getExpandables     : getExpandables, 
        getExpandable      : getExpandable, 
        destroyExpandables : destroyExpandables
    };   
  
})();
  
export const initExpandables = function() {
    
    let expandables = document.querySelectorAll( '[data-expandable-container]' );
    if( expandables == null ) return; 

    for( let i = 0; i < expandables.length; i++ ) {
        Expandables.registerExpandable( expandables[ i ], i );
    }

}
