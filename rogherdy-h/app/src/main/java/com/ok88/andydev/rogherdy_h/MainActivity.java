//5-7-15  JChoy Main Activity for empty tab app created using Android Studio on PC
//5-21-15 JChoy Use LootBag.mCurrentItemNo member;

//Remember to refresh build after adding uses-permission Manifest

package com.ok88.andydev.rogherdy_h;

import com.ok88.andydev.javaid.*;
import java.util.Locale;

import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.content.Context;
import java.io.File;

public class MainActivity extends ActionBarActivity {

    //
    // * The {@link android.support.v4.view.PagerAdapter} that will provide
    // * fragments for each of the sections. We use a
    // * {@link FragmentPagerAdapter} derivative, which will keep every
    // * loaded fragment in memory. If this becomes too memory intensive, it
    // * may be best to switch to a
    // * {@link android.support.v4.app.FragmentStatePagerAdapter}.
    //
    SectionsPagerAdapter mSectionsPagerAdapter;

    //The {@link ViewPager} that will host the section contents.
    ViewPager mViewPager;
    public static DevBed.LootBag mLoot;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mLoot = new DevBed.LootBag(this);

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);
    }

	@Override
	protected void onDestroy() {
		mLoot = null;
		super.onDestroy();
	}

	//
	// refreshPagerAdapter
	public void refreshPagerAdapter(){
		int cur = mLoot.mCurrentItemNo;
		mViewPager.setAdapter(mSectionsPagerAdapter);	//this will nav to pg1, address that later
		if (mSectionsPagerAdapter.getCount() > cur)
			mViewPager.setCurrentItem(cur);
		//mSectionsPagerAdapter.notifyDataSetChanged();	//doesn't do much
	}

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            //if (n==1) tv.setText(getString(R.string.title_section1));
            return true;
        }

        if (id == R.id.action_reload) {
			mLoot.initTabs( mLoot.mCfgFilename );
			mViewPager.setAdapter(mSectionsPagerAdapter);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    //
    // * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
    // * one of the sections/tabs/pages.
    //
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a PlaceholderFragment (defined as a static inner class below).
            return PlaceholderFragment.newInstance(position + 1);
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return mLoot.mItemCount;
        }

    }//inner class

    //
    // * A placeholder fragment containing a simple view.
    // Being an inner static class, the instances will have access to static variables
    //
    public static class PlaceholderFragment extends Fragment {
        private static final String ARG_SECTION_NUMBER = "section_number";

        //
        // * Returns a new instance of this fragment for the given section number
        //
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        // instance constructor
        public PlaceholderFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);

            TextView tv = (TextView) rootView.findViewById(R.id.section_label);
            DevBed.niceTextView( tv );
            int n = getArguments().getInt(ARG_SECTION_NUMBER);
            //tv.setText(mLoot.getText(n));
            mLoot.getText(n, tv);
            return rootView;
        }
    }//inner static class

}//MainActivity
