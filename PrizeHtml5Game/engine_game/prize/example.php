<?php
include('class.base32.php5');

// I'm real lazy...
header('Content-type: text/plain');

// Create a new Base32 object
/*
	You could also call (for example)
		$b = new Base32(Base32::csSafe);
*/
$b = new Base32;
$instr = '21';
$valor = '68RG';
print "Base32::csRFC3548> Input string: $instr\n";
$bstr = $b->fromString($instr);
print "Base32::csRFC3548> Base32 string: $bstr\n";
$outstr = $b->toString($bstr);
print "Base32::csRFC3548> Output string: $outstr\n\n";

// Switch to using Base32::csSafe
$b->setCharset(Base32::csSafe);
print "Base32::csSafe> Input string: $instr\n";
$bstr = $b->fromString($instr);
print "Base32::csSafe> Base32 string: $bstr\n";
$outstr = $b->toString($valor);
print "--Base32::csSafe> Output string: $outstr\n\n";

// Switch to using Base32::cs09AV
$b->setCharset(Base32::cs09AV);
print "Base32::cs09AV> Input string: $instr\n";
$bstr = $b->fromString($instr);
print "Base32::cs09AV> Base32 string: $bstr\n";
$outstr = $b->toString($bstr);
print "Base32::cs09AV> Output string: $outstr\n\n";


print "Now to demonstrate why Base32::csSafe is so handy\n";
// Switch to using Base32::csSafe
$b->setCharset(Base32::csSafe);
$bstr = $b->fromString($instr);
print "Here is the string you want the user to enter: $bstr\n";

// Pretend to be a human...
$fstr = str_replace('1','L',$bstr);
$fstr = str_replace('0','o',$fstr);

print "Here is the string the user has entered: $fstr\n";
print "Note the 1 is an l and the 0 is an o\n";
$outstr = $b->toString($fstr);
print "Here is the output of the decoded string: $outstr\n\n";

// Now we show off
print "\nOf course, you arn't restricted to the default character sets\n";
// Must be 32 chars, and should be upper case...
$chrset = '0987654321QPWOEIRUTYLAKSJDHFGMCZ';

print "Here's a new character set, perhaps you're generating passwords: $chrset\n";
// Switch to customer character set
$b->setCharset($chrset);
print "Customer chrset> Input string: $instr\n";
$bstr = $b->fromString($instr);
print "Customer chrset> Base32 string: $bstr\n";
$outstr = $b->toString($bstr);
print "Customer chrset> Output string: $outstr\n";
