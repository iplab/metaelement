<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
<xsl:output method="html" cdata-section-elements="closeup-closeup_title" />
<xsl:output method="html" cdata-section-elements="closeup_type-name" />
<xsl:output method="html" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
     doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
     
	<xsl:template match="/xml">
		<xsl:apply-templates select="row"/>
	</xsl:template>
	
	<xsl:template match="row">
		<row>
			<xsl:apply-templates select="property"/>
		</row>
	</xsl:template>
	
	<xsl:template match="property">
		<!-- following 8 lines does the character replacement -->
		<xsl:variable name="myString" select="@name" />
		<xsl:variable name="raw">
			 <xsl:call-template name="replaceCharsInString">
	  			 <xsl:with-param name="stringIn" select="string($myString)"/>
			     <xsl:with-param name="charsIn" select="'.'"/>
			     <xsl:with-param name="charsOut" select="'-'"/>
		  	</xsl:call-template>
		</xsl:variable>

		<xsl:choose>
			<xsl:when test="$raw = 'closeup-closeup_id'">
				<actions><![CDATA[<a href="#" onclick="closeups.loadEditCloseup(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" /></a> <a href="#" onclick="closeups.deleteCloseup(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" /></a>]]></actions>
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="{$raw}">
					<xsl:if test=". != 'null'">
						<xsl:value-of select="."/> 
					</xsl:if> 
				</xsl:element>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- here is the template that does the character replacement -->
	<xsl:template name="replaceCharsInString">
		<xsl:param name="stringIn"/>
		<xsl:param name="charsIn"/>
		<xsl:param name="charsOut"/>
		<xsl:choose>
			<xsl:when test="contains($stringIn,$charsIn)">
				<xsl:value-of select="concat(substring-before($stringIn,$charsIn),$charsOut)"/>
				<xsl:call-template name="replaceCharsInString">
					<xsl:with-param name="stringIn" select="substring-after($stringIn,$charsIn)"/>
					<xsl:with-param name="charsIn" select="$charsIn"/>
					<xsl:with-param name="charsOut" select="$charsOut"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$stringIn"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>