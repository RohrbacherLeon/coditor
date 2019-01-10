describe("Testing exercises browsing", function(){

    beforeEach(() => {
        cy.visit("/exercises");
    });

    it("Most popular", function(){
        cy.contains('Les plus populaires');
        
    });

});

