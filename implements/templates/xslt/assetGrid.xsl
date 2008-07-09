<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" cdata-section-elements="actions" />
<xsl:output method="html" cdata-section-elements="thumbnail" />
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
					
		<xsl:if test="$raw = 'media_path'">
		
			<xsl:variable name="id">
				<xsl:for-each select="../property">
					<xsl:if test="@name='media_filename'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

			<xsl:variable name="siteId">
				<xsl:for-each select="../property">
					<xsl:if test="@name='site_id'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>
			
        	<xsl:choose>
		        <xsl:when 
					test="contains($id,'jpg') or 
				  			contains($id,'gif') or 
							contains($id,'jpeg') or
							contains($id,'bmp')">
							<xsl:choose>
						        <xsl:when test="contains($siteId,'universe')">							
									<thumbnail><![CDATA[<img src="/media/]]><xsl:value-of select="$siteId" /><![CDATA[/tn_]]><xsl:value-of select="$id" /><![CDATA[" border=1 alt="Universe Thumbnail" title="Universe Thumbnail" />]]></thumbnail>
								</xsl:when>		
								<xsl:otherwise>
									<thumbnail><![CDATA[<img src="/]]><xsl:value-of select="$siteId"/><![CDATA[/media/]]><xsl:value-of select="."/><![CDATA[/tn_]]><xsl:value-of select="$id" /><![CDATA[" border=1 alt="Thumbnail" title="Thumbnail" />]]></thumbnail>
								</xsl:otherwise>
							</xsl:choose>
		        </xsl:when>
				<xsl:otherwise>
					<thumbnail><![CDATA[no preview available]]></thumbnail>
				</xsl:otherwise>
       		</xsl:choose>
  
		</xsl:if>
		<xsl:if test="$raw = 'media_id'">
			<actions><![CDATA[<a href="#" onclick="assetObj.publish(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/expand.gif" title="Publish" /></a>]]> <![CDATA[<a href="#" onclick="assetObj.edit(']]><xsl:value-of select="."/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/collapse.gif" /></a> <a href="#" onclick="assetObj.erase(']]><xsl:value-of select="."/><![CDATA[',']]><xsl:value-of select="$category"/><![CDATA[');"><img src="/manage/extjs/resources/images/default/basic-dialog/close.gif" /></a>]]></actions>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>