<?php

class DecrementeTest extends \PHPUnit\Framework\TestCase {

    function testSomme_tab(){
        $this->assertEquals(sommetab([1,2,3,4,5]), 15);
    }
}