<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
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
		<xsl:variable name="raw" select="@name" />
		<xsl:if test="$raw = 'optin.optin_id'">
			<selected><![CDATA[<input type="checkbox" checked="true" name="userOptins" value="]]><xsl:value-of select="."/><![CDATA[" />]]></selected>
		</xsl:if>
		<xsl:if test="$raw = 'optin.name'">
			<name><xsl:value-of select="."/></name>
		</xsl:if>
		<xsl:if test="$raw = 'optin.display_text'">
			<display_text><xsl:value-of select="."/></display_text>
		</xsl:if>
		<xsl:if test="$raw = 'optin.is_required'">
			<is_required>
				<xsl:if test=". = '0'">
					false
				</xsl:if> 
				<xsl:if test=". = '1'">
					true
				</xsl:if> 
			</is_required>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
