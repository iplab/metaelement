<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
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

			<xsl:variable name="quizType">
				<xsl:for-each select="../property">
					<xsl:if test="@name='quiz_type'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

        	<xsl:choose>
		        <xsl:when 
					test="contains($quizType,'1')">
					<type><![CDATA[Standard]]></type>
		        </xsl:when>
				<xsl:otherwise>
					<type><![CDATA[Personality]]></type>
				</xsl:otherwise>
       		</xsl:choose>
			
			<xsl:variable name="category">
				<xsl:for-each select="../property">
					<xsl:if test="@name='category_id'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

		<xsl:if test="$raw = 'quiz_id'">
			<actions><![CDATA[<a href="#" onclick="quizObj.publish(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/expand.gif" title="Publish" /></a>]]> <![CDATA[<a href="#" onclick="quizObj.edit(']]><xsl:value-of select="."/><![CDATA[',']]><xsl:value-of select="$quizType"/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" /></a> <a href="#" onclick="quizObj.erase(']]><xsl:value-of select="."/><![CDATA[',']]><xsl:value-of select="$category"/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" /></a>]]></actions>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>