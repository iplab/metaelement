<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
<xsl:output method="html" cdata-section-elements="question" />
<xsl:output method="html" cdata-section-elements="reason" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
     doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
     
	<xsl:template match="/xml">
		<xsl:apply-templates select="object"/>
	</xsl:template>
	
	<xsl:template match="object">
		<row>
		<xsl:apply-templates select="property"/>
		</row>
	</xsl:template>
	
	<xsl:template match="property">
	
		<xsl:variable name="raw" select="@name" />
		<xsl:element name="{$raw}">
		
		<xsl:if test=". != 'null'">
			<xsl:value-of select="."/> 
		</xsl:if> 
		</xsl:element>

		<xsl:if test="$raw = 'question_id'">
			<actions><![CDATA[<a href="#" onclick="quizObj.editQuestion(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" /></a> <a href="#" onclick="quizObj.eraseQuestion(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" /></a>]]></actions>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>