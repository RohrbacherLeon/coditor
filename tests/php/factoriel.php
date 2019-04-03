<?php

class FactorielTest extends \PHPUnit\Framework\TestCase {

    function testFactoriel(){
        $this->assertEquals(factoriel(5), 15);
      }
}