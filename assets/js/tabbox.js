/* File: assets/js/tabbox.js
 * Info: Methods for tab-and-panel widgets
 */

export class Tabbox {
    // Private
    #tabbox;
    #tabbar;
    #deck;
    #tabs = [];
    #panels = [];
    #sidx
    // Public
    constructor(tabbox_el,sidx=0){
        this.#sidx = sidx;
        // Select the tabbox object
        this.#tabbox = document.querySelector(tabbox_el);
        // The tabbox should have two children: the tabbar and the deck.
        // The tabbar contains a list of tabs, one of which is selected.
        this.#tabbar = this.#tabbox.querySelector(".tabbar");
        // The stack of panels is call the "deck", as in a deck of cards. The visible panel corresponds with the selected tab.
        this.#deck   = this.#tabbox.querySelector(".deck");
        // The children of tabbar and deck will be NodeLists, so we will need to use Array.from so that we can apply functional programming methods
        // Select the child elements of the tabbar. Each of them should have the class ".tab"
        this.#tabs   = Array.from(this.#tabbar.children);
        // Select the child elements of the deck. Each of them should have the class ".panel"
        this.#panels = Array.from(this.#deck.children);
        // The selected tab should have the class ".selected"
        this.#tabs.at(this.#sidx).classList.add("selected");
        // All the panels, except for the one the corresponds with the selected tab need a ".hide_panel" class.
        // The the panel that corresponds to the selected tab needs a ".show_panel" class.
        this.#panels.forEach((panel,pidx) => panel.classList.add((pidx !== this.#sidx ) ? "hide_panel" : "show_panel"));
    }
    setDefaultSelectedTab(sidx){
        this.sidx = sidx;
        this.#tabs.at(this.#sidx).classList.add("selected");
        this.#panels.forEach((panel,pidx) => panel.classList.add((pidx !== this.#sidx ) ? "hide_panel" : "show_panel"));
        return this;
    }
    // NOTE: This function doesn't do anything yet.
    setTabbarDirection(dir=0){
        return this;    // best way to make sure nothing happens.
        try{
            switch(dir){
                case 0:
                case "top":
                    // tabbar should be before the panel deck so that the tabs appear on the top
                    break;
                case 1:
                case "bottom":
                    // tabbar should be after the panel deck so that the tabs appear on the bottom
                    break;
                /*
                // Future cases
                case 2:
                case "left":
                    // tabbar should be before the panel deck, but on the left side
                    break;
                case 3:
                case "right":
                    // tabbar should be after the panel deck, but on the right side
                    break;
                */
                case "default": throw `setTabbarDirection: Invalid direction ${dir}`;
            }
        }catch(ex){
            console.error(ex);
        }
        return this;
    }
    getSelectedTab(){
        return this.#tabs.filter((tab) => tab.classList.contains("selected"))[0];
    }
    getSelectedPanel(){
        return this.#panels.filter((panel) => panel.classList.contains("show_panel"))[0];
    }
    setSelectedTab(tab){
        const selectedTab = this.getSelectedTab();
        selectedTab.classList.remove("selected");
        tab.classList.add("selected");
        return this;
    }
    setSelectedPanel(panel){
        const selectedPanel = this.getSelectedPanel();
        selectedPanel.classList.replace("show_panel","hide_panel");
        panel.classList.replace("hide_panel","show_panel");
        return this;
    }
    action(){
        this.#tabs.forEach((tab,tidx) => tab.addEventListener("click", (ev) => this.#panels.forEach((panel,pidx) => {
            //panel.classList.replace("show_panel","hide_panel");
            if(pidx === tidx){
                //panel.classList.replace("hide_panel","show_panel");
                this.setSelectedTab(ev.target);
                this.setSelectedPanel(panel);
            }
        })));
    }
}