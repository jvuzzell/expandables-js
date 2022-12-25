import {screen} from '@testing-library/dom'; 
import userEvent from '@testing-library/user-event';
import {Expandables, initExpandables} from './expandables.js'; 

 function getExpandableExample() {
    return `
        <div data-testid="expandable-1" data-expandable-container="expanded" data-expandable-override=true data-expandable-callback="exampleCallback">
            <button data-expandable-trigger type="button" data-testid="trigger-1"></button>
            <div data-expandable-target="example-target-1"></div>
        </div> 
        <div data-testid="expandable-2" data-expandable-container="expanded">
            <button data-expandable-trigger="" type="button" data-testid="trigger-2"></button>
            <div data-expandable-target="example-target-2"></div>
        </div>
        <div data-testid="expandable-3" data-expandable-container="expanded">
            <button data-expandable-trigger="mouseover" type="button" data-testid="trigger-3"></button>
            <div data-expandable-target="example-target-3"></div>
        </div>
        <div data-expandable-group>
            <div data-testid="expandable-4" data-expandable-container="expanded">
                <button data-expandable-trigger="click" type="button" data-testid="group-trigger-4"></button>
                <div data-expandable-target="example-target-4"></div>
            </div>
            <div data-testid="expandable-5" data-expandable-container="collapsed">
                <button data-expandable-trigger="click" type="button" data-testid="group-trigger-5"></button>
                <div data-expandable-target="example-target-5"></div>
            </div>
            <div data-testid="expandable-6" data-expandable-container="expanded">
                <button data-expandable-trigger="click" type="button" data-testid="group-trigger-6"></button>
                <div data-expandable-target="example-target-6"></div>
            </div>
        </div>
    `;
}

beforeEach(() => { 
    window.exampleCallback = ( event ) => {
        let expandableId = event.target.getAttribute( 'data-expandable-id' ); 
        Expandables.getExpandable( expandableId ).toggle();
    }

    const testContainer = getExpandableExample();
    document.body.innerHTML = testContainer; 
    initExpandables(); 
});

afterEach(() => {
    Expandables.destroyExpandables();
    document.body.innerHTML = ''; 
}); 

test('Expandable Ids attached to triggers', () => { 
    expect(screen.getByTestId( 'trigger-1' )).toHaveAttribute('data-expandable-id', 'example-target-1');
    expect(screen.getByTestId( 'trigger-2' )).toHaveAttribute('data-expandable-id', 'example-target-2');
    expect(screen.getByTestId( 'trigger-3' )).toHaveAttribute('data-expandable-id', 'example-target-3');
    expect(screen.getByTestId( 'group-trigger-4' )).toHaveAttribute('data-expandable-id', 'example-target-4');
    expect(screen.getByTestId( 'group-trigger-5' )).toHaveAttribute('data-expandable-id', 'example-target-5');
    expect(screen.getByTestId( 'group-trigger-6' )).toHaveAttribute('data-expandable-id', 'example-target-6');
}); 

test('Expandable siblings in group collapse when target expandable opened', async () => {
    let targetButton = screen.getByTestId( 'group-trigger-5' );   
    let targetNode = screen.getByTestId( 'expandable-5' );  

    expect( targetNode.getAttribute( 'data-expandable-container' ) ).toBe('collapsed'); 

    await userEvent.click(targetButton).then(() => { 
        let targetNode = screen.getByTestId( 'expandable-5' );  
        let siblingNode4 = screen.getByTestId( 'expandable-4' );
        let siblingNode6 = screen.getByTestId( 'expandable-6' );

        expect( targetNode.getAttribute( 'data-expandable-container' ) ).toBe('expanded'); 
        expect( siblingNode4.getAttribute( 'data-expandable-container' ) ).toBe('collapsed');
        expect( siblingNode6.getAttribute( 'data-expandable-container' ) ).toBe('collapsed'); 
    });
}); 

test('Expandable trigger fires custom callback', async () => {
    let targetButton = screen.getByTestId( 'trigger-1' );   

    await userEvent.click(targetButton).then(() => { 
        let targetNode = screen.getByTestId( 'expandable-1' );    
        expect( targetNode.getAttribute( 'data-expandable-container' ) ).toBe('collapsed'); 
    });
});

test('Expandable triggered on mouse over', async () => {
    let targetButton = screen.getByTestId( 'trigger-3' );   

    await userEvent.hover(targetButton).then(() => { 
        let targetNode = screen.getByTestId( 'expandable-3' );     
        expect( targetNode.getAttribute( 'data-expandable-container' ) ).toBe('collapsed'); 
    });
});