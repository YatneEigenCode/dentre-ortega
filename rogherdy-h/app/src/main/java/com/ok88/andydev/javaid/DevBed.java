//5-13-15  JChoy Support classes in separate folder
//	This allows code to be copied into projects asis without refactoring the package name.
//5-13-15  JChoy foow()

package com.ok88.andydev.javaid;

import java.io.*;
import java.io.InputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import android.content.Context;
import android.os.*;
import android.util.*;

//
// DevBed
//
public class DevBed extends Object {

	//
	// rpt - repeat the string with separator
	//
	public static String rpt(String s, String sep)
	{
		return s+sep+s;
	}

	//
	// foo - returns any string
	//
	public static String foo()
	{
		return "foo-"+ Environment.getExternalStorageDirectory().getAbsolutePath();
	}

	//
	// foow - write foo string to a specified file.
	//
	public static void foow( String filename )
	{
		foow( filename, Environment.getExternalStorageDirectory() );
	}
	//
	// foow - write foo string to a specified file at a specified path.
	//
	public static void foow( String filename, File filepath )
	{
		try {
			File file = new File( filepath, filename );
			FileOutputStream fop = new FileOutputStream( file );
			if (!file.exists()) {
				file.createNewFile();
			}
			fop.write( foo().getBytes() );
			fop.flush();
			fop.close();
		} catch (Exception e) {
			Log.w("File write failed.",e);
		}
	}

	//
	// getAssetTextData
	//
	public static String getAssetTextData(Context ctx, String filename)
	throws IOException
	{
		InputStream input = ctx.getAssets().open(filename,1);
		int size = input.available();

		if (size>0){
			byte[] buffer = new byte[size];
			input.read(buffer);
			input.close();

			String text = new String(buffer);
			return text;
		}
		return null;
	}//method

}//class

