<?php

class SubTest extends \PHPUnit\Framework\TestCase
{
    public function testLaMethodeSoustrait()
    {;
        $this->assertEquals(9, add(6,3));
    }

    public function testFausseMethode()
    {
        $this->assertEquals(10, add(7,3));
    }
}