import {screen, waitFor } from '@testing-library/dom'; 
import userEvent from '@testing-library/user-event';
import {Expandables, initExpandables} from './expandables.js'; 

 function getExpandableExample() {
    return `
        <div data-testid="expandable-1" data-expandable-container="expanded">
            <button data-expandable-trigger="click" type="button"></button>
            <div data-expandable-target="example-target-1"></div>
        </div> 
        <div data-testid="expandable-2" data-expandable-container="expanded">
            <button data-expandable-trigger="click" type="button"></button>
            <div data-expandable-target="example-target-2"></div>
        </div>
        <div data-testid="expandable-3" data-expandable-container="expanded">
        <button data-expandable-trigger type="button"></button>
        <div data-expandable-target="example-target-3"></div>
    </div>
        <div data-expandable-group>
            <div data-testid="expandable-4" data-expandable-container="expanded">
                <button data-expandable-trigger="click" type="button"></button>
                <div data-expandable-target="example-target-4"></div>
            </div>
            <div data-testid="expandable-5" data-expandable-container="collapsed">
                <button data-expandable-trigger="click" type="button" data-testid="group-trigger-5"></button>
                <div data-expandable-target="example-target-5"></div>
            </div>
            <div data-testid="expandable-6" data-expandable-container="collapsed">
                <button data-expandable-trigger="click" type="button" data-testid="group-trigger-2"></button>
                <div data-expandable-target="example-target-6"></div>
            </div>
        </div>
    `;
} 

beforeEach(() => { 
    const testContainer = getExpandableExample();
    document.body.innerHTML = testContainer; 
    initExpandables();
});

afterEach(() => {
    document.body.innerHTML = ``;
}); 

test('Expandables initialization', async () => { 

    await waitFor(() => {
        expect(Expandables.getExpandable( 'example-target-1' ).isExpanded()).toBe(true);
        expect(Expandables.getExpandable( 'example-target-2' ).isExpanded()).toBe(true);
        expect(Expandables.getExpandable( 'example-target-3' ).isExpanded()).toBe(true);
        expect(Expandables.getExpandable( 'example-target-4' ).isExpanded()).toBe(true);
        expect(Expandables.getExpandable( 'example-target-5' ).isExpanded()).toBe(false);
        expect(Expandables.getExpandable( 'example-target-6' ).isExpanded()).toBe(false);
    });

}); 

test('Expandable group collapses when individual opened', async () => { 

    // @Camden - This test fails. 
    let targetButton1 = screen.getByTestId( 'group-trigger-5' );
    let targetNode = screen.findByTestId( 'expandable-5' ); 
    userEvent.click(targetButton1);
    let expanded = (await targetNode).getAttribute( '[data-expandable-container]');

    await waitFor(() => {
        expect(expanded).toBe(true);
    });

});
