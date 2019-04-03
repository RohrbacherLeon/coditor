<?php

class DecrementeTest extends \PHPUnit\Framework\TestCase {

    function testFiltre_tab(){
        $this->assertEquals(filtretab([10,-1,4,12,2], 6), [10,12]);
    }
}