<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
<xsl:output method="html" cdata-section-elements="thumbnail" />
<xsl:output method="html" cdata-section-elements="title" />
<xsl:output method="html" cdata-section-elements="name" />
<xsl:output method="html" cdata-section-elements="description" />
<xsl:output method="html" cdata-section-elements="notes" />
<xsl:output method="html" cdata-section-elements="javascript" />
<xsl:output method="html" cdata-section-elements="main_image" />

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

			<xsl:variable name="category">
				<xsl:for-each select="../property">
					<xsl:if test="@name='category_id'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

		<xsl:if test="$raw = 'page_id'">
			<actions><![CDATA[<a href="#" onclick="pageObj.publish(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/expand.gif" title="Publish" /></a>]]> <![CDATA[<a href="#" onclick="pageObj.edit(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" title="Edit" /></a> <a href="#" onclick="pageObj.erase(']]><xsl:value-of select="."/><![CDATA[',']]><xsl:value-of select="$category"/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" title="Delete" /></a>]]></actions>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>