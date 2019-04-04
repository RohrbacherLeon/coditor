<?php

class SubTest extends \PHPUnit\Framework\TestCase
{
    public function testLaMethodeAdditionne()
    {;
        $this->assertEquals(9, add(6,3));
    }
}